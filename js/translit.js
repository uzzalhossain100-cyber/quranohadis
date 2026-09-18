/* =====================================================================
   আরবি → বাংলা উচ্চারণ ইঞ্জিন (স্বয়ংক্রিয়)
   উসমানি মুসহাফের আরবি পাঠ থেকে বাংলা লিপিতে ধ্বনি-অক্ষর তৈরি করে।
   নিয়মাবলি: হরকত → কার-চিহ্ন | তানওয়ীন → ন | তাশকীল → দ্বিত্ব বর্ণ |
   শামসি লাম হজম | মাদ (ا و ي ى) দীর্ঘ/দ্বিস্বর | সুকুন → হসন্ত বা খালি বর্ণ |
   ওয়াকফে (লাইন-শেষে) শেষ হরকত বর্জন।
   নোট: স্বয়ংক্রিয় ফলাফলে সামান্য ত্রুটি থাকতে পারে।
   ===================================================================== */

"use strict";

const Translit = (() => {

  const S_A = "া", S_I = "ি", S_U = "ু", CJ = "্";

  const CONS = {
    "ب":"ব","ت":"ত","ث":"স","ج":"জ","ح":"হ","خ":"খ","د":"দ","ذ":"য",
    "ر":"র","ز":"য","س":"স","ش":"শ","ص":"ছ","ض":"য","ط":"ত","ظ":"য",
    "غ":"গ","ف":"ফ","ق":"ক","ك":"ক","ل":"ল","م":"ম","ن":"ন","ه":"হ"
  };
  const HAMZA_CHARS = new Set(["ء","أ","إ","ؤ","ئ"]);
  const SHAMSI = new Set(["ت","ث","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ل","ن"]);
  /* যাদের আগে সুকুনযুক্ত বর্ণ হসন্ত ছাড়াই লেখা হয় */
  const BARE_BEFORE = new Set(["ء","أ","إ","ؤ","ئ","ا","ع","ح","ه","ٱ"]);

  const F="َ", K="ِ", U="ُ", FT="ً", KT="ٍ", UT="ٌ",
        SH="ّ", SK="ْ", KHANJ="ٰ";

  function clean(text){
    return text
      .replace(/[\u06D6-\u06DC\u06DF-\u06ED]/g, "")
      .replace(/ـ/g, "")
      .replace(/\u06E1/g, SK)
      .replace(/\s+/g, " ")
      .trim();
  }

  function graphemes(word){
    const g = [];
    let cur = null;
    for (const ch of word){
      if (/[\u064B-\u0653\u0670]/.test(ch)){ if (cur) cur.m.push(ch); }
      else { cur = { ch, m: [] }; g.push(cur); }
    }
    return g.map(x => {
      const m = x.m;
      return {
        ch: x.ch,
        f: m.includes(F), k: m.includes(K), u: m.includes(U),
        ft: m.includes(FT), kt: m.includes(KT), ut: m.includes(UT),
        sh: m.includes(SH), sk: m.includes(SK), khj: m.includes(KHANJ)
      };
    });
  }

  function transliterate(text){
    text = clean(text);
    if (!text) return "";
    const words = text.split(" ").map(graphemes);

    /* ওয়াকফ — শেষ বর্ণের হরকত/তানওয়ীন বাদ */
    const lastWord = words[words.length - 1];
    if (lastWord && lastWord.length){
      const L = lastWord[lastWord.length - 1];
      L.f = L.k = L.u = L.ft = L.kt = L.ut = false;
    }

    const out = [];
    let lastVowel = null;
    const push = s => { if (s) out.push(s); };
    const setVowel = kind => { lastVowel = { seg: out.length - 1, kind }; };

    function upgrade(kind){
      if (!lastVowel) return;
      const i = lastVowel.seg;
      const seg = out[i] || "";
      if (kind === "i"){
        if (/ি$/.test(seg)) out[i] = seg.replace(/ি$/, "ী");
        else if (/ই$/.test(seg)) out[i] = seg.replace(/ই$/, "ঈ");
      } else if (kind === "u"){
        if (/ু$/.test(seg)) out[i] = seg.replace(/ু$/, "ূ");
        else if (/উ$/.test(seg)) out[i] = seg.replace(/উ$/, "ঊ");
      }
    }

    const isLastOverall = (wi, wordEnd) => wordEnd && wi === words.length - 1;

    /* হরফে মুক্বাত্তা'আত — নির্ঘণ্ট বর্ণের শব্দ: حروفের নামে পাঠ */
    const LETTER_NAMES = {
      "ا":"আলিফ","ٱ":"আলিফ","آ":"আলিফ","ح":"হা","ر":"রা","س":"সীন","ص":"ছাদ",
      "ط":"তোয়া","ع":"আইন","ق":"ক্বাফ","ك":"কাফ","ل":"লাম","م":"মীম","ن":"নূন",
      "ه":"হা","ي":"ইয়া"
    };
    const isMuqattaat = g =>
      g.length >= 1 && g.length <= 7 &&
      g.every(x => LETTER_NAMES[x.ch] && !x.f && !x.k && !x.u && !x.sh && !x.sk &&
                  !x.ft && !x.kt && !x.ut) &&
      g.some(x => x.ch !== "ا" && x.ch !== "ٱ");

    words.forEach((g, wi) => {
      if (wi > 0) push(" ");

      if (isMuqattaat(g)){
        push(g.map(x => LETTER_NAMES[x.ch]).join(" "));
        lastVowel = null;
        return;
      }

      for (let i = 0; i < g.length; i++){
        const cur = g[i];
        const nxt = g[i + 1] || null;
        const wordStart = i === 0;
        const wordEnd = !nxt;
        /* তানওয়ীনকেও স্বর হিসেবে ধরা */
        const vf = cur.f || cur.ft, vk = cur.k || cur.kt, vu = cur.u || cur.ut;
        const vs = vf ? S_A : vk ? S_I : vu ? S_U : "";
        const tw = (cur.ft || cur.kt || cur.ut) && !isLastOverall(wi, wordEnd) ? "ন" : "";

        /* ================= ا / ٱ ================= */
        if (cur.ch === "آ"){ push("আ"); setVowel("a"); continue; }
        if (cur.ch === "ا" || cur.ch === "ٱ"){
          if (cur.ft || cur.kt || cur.ut){
            push(tw); lastVowel = null; continue;
          }
          if (cur.f || cur.k || cur.u){
            const v = cur.f ? "আ" : cur.k ? "ই" : "উ";
            push(v); setVowel(v === "আ" ? "a" : v === "ই" ? "I" : "U");
            continue;
          }
          if (wordStart){ /* হামযাতুল ওয়াসল */
            const prev = wi > 0 ? out[out.length - 2] || "" : "";
            if (wi > 0 && out[out.length - 1] === " " && /[া-ৌ]$/.test(prev)){
              out.pop(); /* আগের শব্দের স্বরে মিলে যায় */
            } else {
              push("আ"); setVowel("a");
            }
          }
          /* শব্দ-মাঝের মাদ আলিফ — আগের 'া' ই যথেষ্ট */
          continue;
        }

        /* ================= ى ================= */
        if (cur.ch === "ى"){
          push(tw);
          lastVowel = null;
          continue;
        }

        /* ================= همزة-ধারক ================= */
        if (HAMZA_CHARS.has(cur.ch)){
          if (vf) { push("আ"); setVowel("a"); }
          else if (vk) { push("ই"); setVowel("I"); }
          else if (vu) { push("উ"); setVowel("U"); }
          else if (wordStart) { push("আ"); } /* সুকুনযুক্ত همزة মাঝে: يُؤْمِنُ → ইয়ুমিনু */
          else lastVowel = null;
          push(tw);
          continue;
        }

        /* ================= ع ================= */
        if (cur.ch === "ع"){
          if (vf) { push("আ"); setVowel("a"); }
          else if (vk) { push("ই"); setVowel("I"); }
          else if (vu) { push("উ"); setVowel("U"); }
          else { lastVowel = null; } /* عْ — যেমন: نَعْبُدُ = নাবুদু */
          push(tw);
          continue;
        }

        /* ================= و ================= */
        if (cur.ch === "و"){
          if (cur.khj) { lastVowel = null; continue; } /* وٰ (صَّلَوٰة) — আলিফ-মাদ */
          if (vf || vk || vu){
            if (cur.sh) push("উ");
            push("ওয়" + vs);
            setVowel(vf ? "a" : vk ? "i" : "u");
            push(tw);
          } else {
            const last = out[out.length - 1] || "";
            if (/া$/.test(last)) push("উ");           /* فَوْ → দ্বিস্বর */
            else if (/ু$|ূ$|উ$|ঊ$/.test(last)) upgrade("u");
            else if (/ি$|ী$|ই$|ঈ$/.test(last)) push("উ");
            else upgrade("u");
            lastVowel = null;
          }
          continue;
        }

        /* ================= ي ================= */
        if (cur.ch === "ي"){
          /* hamza-kasra পরে: إِيَّاكَ → ইয়্যাকা */
          const afterKasraHamza = i > 0 && HAMZA_CHARS.has(g[i - 1].ch) && g[i - 1].k;
          if (cur.sh){
            push((afterKasraHamza ? "য়্য" : "ইয়্য") + (vs || S_A));
            setVowel(vk ? "i" : vu ? "u" : "a");
            push(tw);
          } else if (vf || vk || vu){
            push((afterKasraHamza ? "য়" : "ইয়") + vs);
            setVowel(vf ? "a" : vk ? "i" : "u");
            push(tw);
          } else {
            const last = out[out.length - 1] || "";
            if (/া$/.test(last)) push("ই");           /* عَيْنٌ → দ্বিস্বর */
            else upgrade("i");
            lastVowel = null;
          }
          continue;
        }

        /* ================= ة ================= */
        if (cur.ch === "ة"){
          if (vf || vk || vu){
            push("ত" + vs);
            setVowel(vf ? "a" : vk ? "i" : "u");
            push(tw);
          } else {
            push("হ"); lastVowel = null;
          }
          continue;
        }

        /* ========== ال এর লাম (উসমানি খত: সুকুন অনুসৃত, চিহ্ন নেই) ========== */
        if (cur.ch === "ل" && nxt && !cur.f && !cur.k && !cur.u && !cur.sh && !cur.ft && !cur.kt && !cur.ut){
          const prevG = i > 0 ? g[i - 1] : null;
          const prevIsAlif = prevG && (prevG.ch === "ا" || prevG.ch === "ٱ" || prevG.ch === "آ");
          if (nxt.ch === "ل" && nxt.sh){ lastVowel = null; continue; }                      /* الله / لله */
          if (prevIsAlif && SHAMSI.has(nxt.ch) && nxt.sh){ lastVowel = null; continue; }    /* শামসি হজম */
          if (prevIsAlif){ push("ল"); lastVowel = null; continue; }                          /* কামারি লাম */
        }

        /* ================= সাধারণ ব্যঞ্জন ================= */
        const C = CONS[cur.ch];
        if (C){
          if (cur.sh){
            /* ضّ — প্রচলিত বাংলা রীতিতে "দ্দ" */
            if (cur.ch === "ض") push("দ্দ" + vs || "দ্দ");
            else if (vs) { push(C + CJ); push(C + vs); }
            else push(C + CJ + C);
            if (vs) setVowel(vf ? "a" : vk ? "i" : "u");
            else lastVowel = null;
            push(tw);
            continue;
          }
          if (vs){
            push(C + vs);
            setVowel(vf ? "a" : vk ? "i" : "u");
            push(tw);
          } else {
            const bareNext = wordEnd || (nxt && BARE_BEFORE.has(nxt.ch));
            push(bareNext ? C : C + CJ);
            lastVowel = null;
          }
          continue;
        }

        push(cur.ch);
        lastVowel = null;
      }
    });

    let res = out.join("");
    res = res.replace(/্$/, "");
    return res;
  }

  return { toBn: transliterate };
})();

if (typeof module !== "undefined") module.exports = Translit;
