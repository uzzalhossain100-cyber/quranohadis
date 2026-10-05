/* =====================================================================
   অনুসন্ধান (প্রশ্নোত্তর) — লিখে বা বলে যেকোনো প্রশ্ন করুন;
   অ্যাপের কুরআন·দোয়া·হাদিস·সময়সূচি থেকে উত্তর খুঁজে এনে লেখায় দেখায়
   এবং স্বয়ংক্রিয়ভাবে পড়েও শোনায় (টেক্সট-টু-স্পিচ)।
   ===================================================================== */

"use strict";

/* -------------------- টেক্সট স্বাভাবিককরণ -------------------- */
function qaNorm(s){
  return String(s || "")
    .replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d))
    .toLowerCase()
    .replace(/[’‘'\"“”。,।|!?:;•…~\-ـ()\[\]{}<>@#\$%\^&*_+=\/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const QA_STOP = new Set(("কি কী কোন কোনটি এর তে তো না কি করে করো করুন করবেন দাও দিন দেন দেখাও দেখান শুনাও শোনাও শোনান বলো বলুন বলে বলেন হলে হইলো আমাকে আমায় টা টি গুলো পড়ে পড়ো পড়ুন পাঠ জানাও জানান আছে আছেন এখানে সেখানে অমুক কিন্তু তাই যে যেটা যার যারা একটি একটু কিছু কেন কেমন জন্য নিয়ে সম্পর্কে উপর থেকে মধ্যে হতে করে নমক অনুগ্রহ করে ও হয় পবিত্র মাহে")
  .split(" "));
function qaTokens(qn){
  return qn.split(" ").filter(w => w.length > 1 && !QA_STOP.has(w));
}

/* -------------------- সূরা নামের আলিয়াস -------------------- */
const QA_S_ALIAS_RAW = {
  "ফাতিহা":1,"ফাতেহা":1,"বাকারা":2,"ইমরান":3,"নিসা":4,"মায়িদা":5,"মাইদা":5,"আনআম":6,"আরাফ":7,"আনফাল":8,"তওবা":9,"তাওবা":9,"ইউনুস":10,"হুদ":11,"ইউসুফ":12,"রাদ":13,"ইব্রাহিম":14,"হিজর":15,"নাহল":16,"ইসরা":17,"বনি ইসরাইল":17,"কাহফ":18,"মারইয়াম":19,"ত্বহা":20,"ত্বাহা":20,"আম্বিয়া":21,"হাজ্জ":22,"হজ":22,"মুমিনুন":23,"নূর":24,"নুর":24,"ফুরকান":25,"শুআরা":26,"নামল":27,"কাসাস":28,"আনকাবুত":29,"রুম":30,"রূম":30,"লোকমান":31,"সাজদা":32,"আহযাব":33,"সাবা":34,"ফাতির":35,"ইয়াসিন":36,"ইয়াসীন":36,"সাফফাত":37,"ছাদ":38,"সাদ":38,"যুমার":39,"ফুসসিলাত":41,"মুমিন":40,"গাফির":40,"শূরা":42,"যুখরুফ":43,"দুখান":44,"জাসিয়া":45,"আহকাফ":46,"মুহাম্মাদ":47,"ফাতহ":48,"হুজুরাত":49,"ক্বাফ":50,"জারিয়াত":51,"তূর":52,"নাজম":53,"ক্বামার":54,"রহমান":55,"ওয়াকিয়া":56,"ওয়াকেয়া":56,"হাদীদ":57,"মুজাদালা":58,"হাশর":59,"মুমতাহিনা":60,"সাফ":61,"জুমুআ":62,"জুমা":62,"মুনাফিকুন":63,"তাগাবুন":64,"তালাক":65,"তাহরীম":66,"মুলক":67,"মূলক":67,"কলম":68,"হাক্কা":69,"মাআরিজ":70,"নূহ":71,"নোহ":71,"জ্বিন":72,"মুযযাম্মিল":73,"মুজাম্মিল":73,"মুদ্দাসসির":74,"কিয়ামা":75,"কিয়ামত":75,"ইনসান":76,"মুরসালাত":77,"নাবা":78,"নাযিআত":79,"আবাসা":80,"তাকভীর":81,"ইনফিতার":82,"মুতাফফিফীন":83,"ইনশিকাক":84,"বুরুজ":85,"তারিক":86,"আলা":87,"গাশিয়া":88,"ফাজর":89,"বালাদ":90,"শামস":91,"লাইল":92,"দুহা":93,"ইনশিরাহ":94,"তীন":95,"আলাক":96,"কদর":97,"বাইয়িনা":98,"জিলজিলা":99,"জালজালা":99,"যালযালা":99,"আদিয়াত":100,"কারিয়া":101,"তাকাসুর":102,"আসর":103,"হুমাযা":104,"ফীল":105,"কুরাইশ":106,"মাউন":107,"কাউসার":108,"কাফিরুন":109,"কাফেরুন":109,"নাসর":110,"লাহাব":111,"ইখলাস":112,"ইখলাছ":112,"ফালাক":113,"নাস":114,
  "fatiha":1,"fatihaa":1,"baqarah":2,"baqara":2,"imran":3,"nisa":4,"kahf":18,"yaseen":36,"yasin":36,"rahman":55,"waqiah":56,"mulk":67,"jumuah":62,"duha":93,"asr":103,"ikhlas":112,"falaq":113,"nas":114
};
const QA_S_ALIASES = {};
(function(){
  for (const k in QA_S_ALIAS_RAW) QA_S_ALIASES[qaNorm(k).replace(/\s+/g,"")] = QA_S_ALIAS_RAW[k];
  /* মেটা থেকে বাংলা নাম: "আল-ফাতিহা" → "ফাতিহা" */
  try {
    SURAH_META.forEach(m => {
      const n = qaNorm(m[2]).replace(/^আল /,"").replace(/\s+/g,"");
      if (n && !(n in QA_S_ALIASES)) QA_S_ALIASES[n] = m[0];
    });
  } catch(e){}
})();

function qaFindSurah(qn){
  /* সংখ্যা-দেখে সূরা: "সূরা নম্বর ৩", "৩ নং সূরা" */
  let m = qn.match(/সূরা[হ]?[^০-৯0-9]*?(?:নম্বর|নং)?[^০-৯0-9]*?(\d{1,3})\b/);
  if (m){ const n = +m[1]; if (n >= 1 && n <= 114) return { n, clipped: qn.slice(0, m.index) + " " + qn.slice(m.index + m[0].length) }; }
  m = qn.match(/\b(\d{1,3})\s*(?:নম্বর|নং)?\s*সূরা/);
  if (m){ const n = +m[1]; if (n >= 1 && n <= 114) return { n, clipped: qn.slice(0, m.index) + " " + qn.slice(m.index + m[0].length) }; }
  /* নাম-দেখে — দীর্ঘ আলিয়াস আগে */
  const keys = Object.keys(QA_S_ALIASES).sort((a,b) => b.length - a.length);
  const compact = qn.replace(/\s+/g, "");
  for (const k of keys){
    if (compact.includes(k)) return { n: QA_S_ALIASES[k], clipped: qn };
  }
  return null;
}

/* -------------------- সূরা আনাক্রম (অফলাইন + অনলাইন) -------------------- */
const qaCache = {};
async function qaGetSurah(n){
  if (typeof BUNDLED !== "undefined" && BUNDLED[n]) return BUNDLED[n].map(a => ({ ar:a[0], uc:a[1], bn:a[2] }));
  if (qaCache[n]) return qaCache[n];
  const ctrl = (typeof AbortSignal !== "undefined" && AbortSignal.timeout) ? { signal: AbortSignal.timeout(22000) } : {};
  const r = await fetch("https://api.alquran.cloud/v1/surah/" + n + "/editions/quran-uthmani,bn.bengali", ctrl);
  if (!r.ok) throw new Error("network");
  const j = await r.json();
  const ar = (j.data && j.data[0] && j.data[0].ayahs) || [];
  const bnE = (j.data && j.data[1] && j.data[1].ayahs) || [];
  const list = ar.map((a,i) => ({ ar:a.text, bn: bnE[i] ? bnE[i].text : "", uc: (typeof Translit !== "undefined" ? Translit.toBn(a.text) : "") }));
  qaCache[n] = list;
  return list;
}

/* -------------------- স্পিচ-ইঞ্জিন (টেক্সট→কণ্ঠ) -------------------- */
const qaSpeech = { list:[], idx:0, playing:false, paused:false, last:null };
function qaSupportsTTS(){ return typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function"; }
function qaVoicesNow(){ try { return qaSupportsTTS() ? window.speechSynthesis.getVoices() : []; } catch(e){ return []; } }
function qaHasVoice(langPrefix){
  const lp = langPrefix.toLowerCase();
  return qaVoicesNow().some(v => v && v.lang && v.lang.toLowerCase().replace(/_/g,"-").startsWith(lp));
}
function qaStopSpeech(){
  qaSpeech.list = []; qaSpeech.idx = 0; qaSpeech.playing = false; qaSpeech.paused = false;
  if (qaSupportsTTS()){ try { window.speechSynthesis.cancel(); } catch(e){} }
  qaPlayerUpdate();
}
if (typeof window !== "undefined" && qaSupportsTTS()){
  try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = function(){}; } catch(e){}
}

function qaSegmentsSpeak(list){
  qaSpeech.list = list;
  qaSpeech.idx = 0;
  qaPlayerUpdate();
  if (list.length) qaPlayCurrent();
}
function qaPlayCurrent(){
  if (!qaSupportsTTS() || qaSpeech.idx >= qaSpeech.list.length){ qaSpeech.playing = false; qaSpeech.paused = false; qaPlayerUpdate(); return; }
  const seg = qaSpeech.list[qaSpeech.idx];
  const u = new window.SpeechSynthesisUtterance(seg.t);
  const lang = seg.lang === "ar" ? "ar-SA" : (seg.lang === "en" ? "en-US" : "bn-BD");
  u.lang = lang;
  u.rate = seg.lang === "ar" ? 0.85 : 0.95;
  u.pitch = 1;
  window.speechSynthesis.cancel();
  qaSpeech.playing = true; qaSpeech.paused = false;
  qaPlayerUpdate(seg);
  u.onend = function(){
    qaSpeech.idx++;
    if (qaSpeech.idx < qaSpeech.list.length) qaPlayCurrent();
    else { qaSpeech.playing = false; qaSpeech.paused = false; qaPlayerUpdate(); }
  };
  u.onerror = function(){
    qaSpeech.idx++;
    if (qaSpeech.idx < qaSpeech.list.length) qaPlayCurrent();
    else { qaSpeech.playing = false; qaSpeech.paused = false; qaPlayerUpdate(); }
  };
  try { window.speechSynthesis.speak(u); } catch(e){ qaSpeech.playing = false; qaPlayerUpdate(); }
}
function qaPlayerUpdate(currentSeg){
  const pb = $("#qaPlayer"); if (!pb) return;
  const btnP = $("#qaReplay"), btnR = $("#qaPause"), tot = $("#qaProg"), now = $("#qaNow");
  const seg = currentSeg || qaSpeech.list[qaSpeech.idx];
  if (tot) tot.textContent = qaSpeech.list.length ? (bn(qaSpeech.idx+1) + "/" + bn(qaSpeech.list.length) + " কণ্ঠাংশ") : "";
  if (now) now.textContent = qaSpeech.playing && seg ? seg.t.slice(0, 60) + (seg.t.length > 60 ? "…" : "") : (qaSpeech.list.length ? (qaSpeech.idx >= qaSpeech.list.length ? "শোনানো শেষ — আবার শুনতে চাপুন" : "শোনার জন্য প্রস্তুত") : "");
  if (btnR) btnR.style.display = qaSpeech.playing ? "" : "none";
  if (btnP) btnP.style.display = "";
  const bar = $("#qaBar");
  if (bar) bar.style.width = qaSpeech.list.length ? Math.min(100, (qaSpeech.idx) / qaSpeech.list.length * 100) + "%" : "0%";
}

/* -------------------- উত্তর রেন্ডার -------------------- */
function qaRenderRes(res, autoSpeak){
  const box = $("#askResult"); if (!box) return;
  const ttsOK = qaSupportsTTS();
  box.innerHTML = `
  <section class="qa-ans">
    ${res.title ? `<h3 class="qa-title">${res.title}</h3>` : ""}
    ${res.note ? `<p class="qa-note">${res.note}</p>` : ""}
    ${res.segments && res.segments.length ? (ttsOK ? `
      <div class="qa-player" id="qaPlayer">
        <div class="qa-pbar"><span id="qaBar"></span></div>
        <div class="qa-prow">
          <button class="qa-btn gold" id="qaReplay">${I.play} শুনুন</button>
          <button class="qa-btn" id="qaPause" style="display:none">${I.pause} বিরতি</button>
          <button class="qa-btn" id="qaStopB">■ বন্ধ</button>
          <span class="qa-prog" id="qaProg"></span>
        </div>
        <p class="qa-now" id="qaNow"></p>
      </div>` : `<p class="qa-note">এই ডিভাইসে কণ্ঠে শোনার ব্যবস্থা (টেক্সট-টু-স্পিচ) নেই — লেখাটি নিচে পড়ুন।</p>`) : ""}
    <div class="qa-body">${res.html || ""}</div>
    ${res.moreBtn ? `<button class="qa-btn gold qa-more" id="qaMoreBtn">${I.play} পরের অংশ শোনাও</button>` : ""}
  </section>`;

  const rp = $("#qaReplay");
  if (rp) rp.addEventListener("click", ()=>{
    if (!qaSpeech.list.length) return;
    if (qaSpeech.idx >= qaSpeech.list.length) qaSpeech.idx = 0;
    qaPlayCurrent();
  });
  const pz = $("#qaPause");
  if (pz) pz.addEventListener("click", ()=>{
    if (!qaSupportsTTS()) return;
    if (qaSpeech.paused){ window.speechSynthesis.resume(); qaSpeech.paused = false; pz.innerHTML = I.pause + " বিরতি"; }
    else { window.speechSynthesis.pause(); qaSpeech.paused = true; pz.innerHTML = I.play + " চালিয়ে যান"; }
  });
  const sb = $("#qaStopB");
  if (sb) sb.addEventListener("click", qaStopSpeech);

  const mb = $("#qaMoreBtn");
  if (mb) mb.addEventListener("click", ()=>{ qaContinueLast(); });

  if (autoSpeak && res.segments && res.segments.length && ttsOK){
    qaSegmentsSpeak(res.segments);
  } else {
    qaSpeech.list = res.segments ? res.segments.slice() : [];
    qaSpeech.idx = 0; qaSpeech.playing = false;
    qaPlayerUpdate();
  }
  try { box.scrollIntoView({ behavior:"smooth", block:"start" }); } catch(e){}
}

/* -------------------- কুরআন-ইনটেন্ট মোড -------------------- */
function qaModeFrom(qn){
  const wantAr = /আরবি|তিলাওয়াত|তেলাওয়াত|tilawat|recite|arabic|قر/.test(qn);
  const wantUc = /উচ্চারণ|উচারণ|শুদ্ধ|pronunciation/.test(qn);
  const wantBn = /অনুবাদ|অর্থ|ভাবার্থ|বাংলা|translation/.test(qn);
  let parts = [];
  if (wantAr) parts.push("ar");
  if (wantUc) parts.push("uc");
  if (wantBn) parts.push("bn");
  if (!parts.length) parts = ["ar","bn"];
  return parts;
}

const QA_READ_CHUNK = 15;
let qaLast = null; /* { n, next, mode } — পরের অংশ চালিয়ে যাওয়ার অবস্থা */

function qaAyahCard(n, a, i){
  return `
  <article class="ayah">
    <div class="badge-row"><span class="ayah-badge">৲ ${bn(i+1)}</span></div>
    <p class="ar" lang="ar">${a.ar}</p>
    <p class="uc"><i>উচ্চারণ</i>${a.uc}</p>
    <p class="bn"><i>অনুবাদ</i>${a.bn}</p>
  </article>`;
}

function qaBuildSurahRead(surahNo, fromAyah, toAyah, mode, opts){
  const meta = SURAH_META.find(m => m[0] === surahNo);
  return qaGetSurah(surahNo).then(list => {
    const total = list.length;
    const from = Math.max(1, fromAyah || 1);
    const planTo = Math.min(total, toAyah || (from + QA_READ_CHUNK - 1));
    const segs = [];
    const parts = mode;
    segs.push({ t: "সূরা " + meta[2] + " — আয়াত " + bn(from) + (planTo > from ? " থেকে " + bn(planTo) : ""), lang:"bn" });
    for (let i = from; i <= planTo; i++){
      const a = list[i-1];
      const prefix = (opts && opts.quietAyahNo) ? "" : "আয়াত " + bn(i) + "। ";
      if (parts.includes("ar")){
        if (qaHasVoice("ar")) segs.push({ t: a.ar, lang:"ar", uc:a.uc, no:i });
        else segs.push({ t: prefix + "উচ্চারণ — " + a.uc, lang:"bn", no:i });
      }
      if (parts.includes("uc")) segs.push({ t: prefix + a.uc, lang:"bn", no:i });
      if (parts.includes("bn")) segs.push({ t: prefix + a.bn, lang:"bn", no:i });
    }
    const hasMore = planTo < total;
    if (hasMore){
      segs.push({ t: "এই ছিল " + bn(planTo) + " নম্বর আয়াত পর্যন্ত। পরের অংশ শুনতে বলুন — পরের অংশ।", lang:"bn" });
      qaLast = { n: surahNo, next: planTo + 1, mode, to: toAyah || 0 };
    } else if (toAyah && toAyah < total){
      qaLast = null;
    } else {
      qaLast = null;
    }
    const cards = [];
    for (let i = from; i <= planTo; i++) cards.push(qaAyahCard(surahNo, list[i-1], i));
    return {
      title: "সূরা " + meta[2],
      note: "আয়াত " + bn(from) + (planTo > from ? "–" + bn(planTo) : "") + " (মোট " + bn(total) + " আয়াত)" + (hasMore ? " — বাকি " + bn(total - planTo) + " আয়াত নিচের বোতামে/বলে শুনতে পারেন" : ""),
      html: cards.join(""),
      segments: segs,
      moreBtn: hasMore
    };
  });
}

function qaContinueLast(){
  if (!qaLast){ return; }
  const mode = qaLast.mode;
  qaStopSpeech();
  const p = qaBuildSurahRead(qaLast.n, qaLast.next, qaLast.to || 0, mode);
  p.then(res => qaRenderRes(res, true)).catch(()=>{ qaRenderRes({ title:"দুঃখিত", note:"অংশটি এই মুহূর্তে আনা যায়নি — ইন্টারনেট পরীক্ষা করুন।", html:"" }, false); });
}

/* -------------------- উত্তর-ইঞ্জিন -------------------- */
async function qaAnswer(raw){
  const qn = qaNorm(raw);
  if (!qn) return { title:"কিছু লিখুন বা বলুন", note:"নিচের বাক্সে প্রশ্ন লিখুন বা মাইকে চেপে বলুন।", html:"" };

  /* "লিখে দাও"-ধরনের প্রশ্নে নিজে থেকে পড়ে না শোনায় — শুধু লেখা দেখায় (অন্যথায় সবসময় কণ্ঠেও শোনাবে) */

  /* ০. পরবর্তী অংশ চাওয়া */
  if (/পরের অংশ|বাকি অংশ|বাকিটা|আবার শোনাও|আবার শোনাও|পরেরটা/.test(qn) && qaLast){
    qaContinueLast();
    return null;
  }

  /* ১. আয়াতুল কুরসি */
  if (/কুরসি/.test(qn)){
    const mode = qaModeFrom(qn);
    return qaBuildSurahRead(2, 255, 255, mode).then(res => {
      res.title = "আয়াতুল কুরসি (সূরা আল-বাকারা: ২৫৫)";
      res.segments.unshift({ t:"আয়াতুল কুরসি — সূরা আল-বাকারার ২৫৫ নম্বর আয়াত। কুরআনের শ্রেষ্ঠ আয়াত, যা পড়লে ফেরেশতা দ্বারা হেফাজতের সংবাদ আছে।", lang:"bn" });
      return res;
    });
  }

  /* ২. নামাজ/সেহরি/ইফতার সময় */
  if (/নামাজ|ওয়াক্ত|ফজর|ফজরের|জোহর|যোহর|আসর|মাগরিব|ইশা|এশা|সেহরি|সেহেরি|ইফতার/.test(qn) && /সময়|কটা|ক'টা|কয়টা|কত/.test(qn)){
    const lines = [];
    const wmap = [ ["fajr","ফজর"], ["dhuhr","জোহর"], ["asr","আসর"], ["maghrib","মাগরিব"], ["isha","এশা"] ];
    const stOk = (typeof ST !== "undefined" && ST);
    const pick = qn.includes("ফজর") ? ["fajr"] : (qn.includes("জোহর") || qn.includes("যোহর")) ? ["dhuhr"] : qn.includes("আসর") ? ["asr"] : qn.includes("মাগরিব") ? ["maghrib"] : (qn.includes("এশা") || qn.includes("ইশা")) ? ["isha"] : [];
    const use = pick.length ? wmap.filter(w=>pick.includes(w[0])) : wmap;
    if (stOk){
      use.forEach(w => { if (typeof ST[w[0]] === "number") lines.push("• " + w[1] + " — " + sunLabel(ST[w[0]])); });
    }
    const siOk = (typeof SI !== "undefined" && (qn.includes("সেহরি") || qn.includes("সেহেরি") || qn.includes("ইফতার") || !pick.length));
    let siTxt = "";
    if (siOk){
      if (SI.se != null) siTxt += " • সেহরি-শেষ — " + sunLabel(SI.se);
      if (SI.ift != null) siTxt += " • ইফতার — " + sunLabel(SI.ift);
    }
    if (lines.length || siTxt){
      const sp = ("আজকের ঢাকার সময় অনুযায়ী " + lines.join(", ") + (siTxt ? "," + siTxt : "") + "।").replace("• ","").replace(/ • /g, ", ");
      return {
        title:"সময়সূচি (ঢাকা)",
        html:`<div class="qa-card"><p>${(lines.join(" ")+siTxt).replace(/ • /g,"<br>")}</p></div>`,
        segments:[{ t:sp, lang:"bn" }]
      };
    }
    return { title:"সময়সূচি", note:"আজকের সময়সূচি এখনো আসেনি — একটু পরে আবার জিজ্ঞেস করুন বা হোম পাতা দেখুন।", html:"" };
  }

  /* ৩. তারিখ */
  if (/তারিখ|হিজরি|কি বার|কোন বার|আজকে কি/.test(qn)){
    const RD = (typeof remoteDate !== "undefined" && remoteDate.data) || {};
    const now = new Date();
    const en = RD.en || (typeof gregorianBn === "function" ? gregorianBn(now) : "");
    const bnD = RD.bn || (typeof banglaDate === "function" ? banglaDate(now) : "");
    const ar = RD.ar || (typeof hijriDate === "function" ? (hijriDate(now) || "") : "");
    const wd = (typeof WEEKDAYS !== "undefined" ? WEEKDAYS[now.getDay()] : "");
    const txt = "আজ " + wd + "বার। ইংরেজি: " + en + "। বাংলা: " + bnD + (ar ? "। হিজরি: " + ar + "।" : "।");
    return {
      title:"আজকের তারিখ",
      html:`<div class="qa-card"><p><b>${en}</b><br>${bnD}${ar ? "<br>" + ar : ""}<br><span class="qa-dim">${wd}বার — হিজরি তারিখ চাঁদ দেখা সাপেক্ষে একদিন আগে-পরে হতে পারে</span></p></div>`,
      segments:[{ t:txt, lang:"bn" }]
    };
  }

  /* ৪. সূরা-ইনটেন্ট (সূরা বা আয়াত) */
  const sHit = qaFindSurah(qn);
  const hasQWord = /সূরা|আয়াত|tilawat|তিলাওয়াত|কুরান|কুরআন/.test(qn);
  if (sHit || /আয়াত/.test(qn) && /\d/.test(qn)){
    if (!sHit){
      return { title:"কোন সূরা?", note:"সূরার নাম বা নম্বরটি বলুন — যেমন: সূরা আল-বাকারার ২৫৫ নম্বর আয়াত শোনাও।", html:"" };
    }
    const n = sHit.n;
    const meta = SURAH_META.find(m => m[0] === n);
    const nums = (qn.match(/\d{1,3}/g) || []).map(Number);
    const range = qn.match(/(\d{1,3})\s*থেকে\s*(\d{1,3})/);
    let fromA = 0, toA = 0;
    if (/আয়াত/.test(qn) || range){
      if (range){ fromA = +range[1]; toA = +range[2]; }
      else if (nums.length){ fromA = nums[nums.length - 1]; toA = fromA; }
      if (!fromA || fromA < 1 || fromA > meta[4])
        return { title:"আয়াতের নম্বর ঠিক নয়", note:"সূরা " + meta[2] + "-এ মোট " + bn(meta[4]) + " আয়াত আছে — " + bn(Math.min(Math.max(1, fromA||1), meta[4])) + "-এর মধ্যে একটি নম্বর বলুন।", html:"" };
      const mode = qaModeFrom(qn);
      return qaBuildSurahRead(n, fromA, toA, mode);
    }
    /* পুরো সূরা */
    const mode = qaModeFrom(qn);
    return qaBuildSurahRead(n, 1, 0, mode);
  }

  /* ৫. আজকের বাণী */
  if (/বাণী/.test(qn)){
    const now = new Date();
    const bani = DAILY_BANI[ Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000) % DAILY_BANI.length ];
    return {
      title:"আজকের বাণী",
      html:`<div class="qa-card"><p class="qa-quote">“${bani.q}”</p><p class="qa-dim">${bani.r}</p></div>`,
      segments:[{ t:"আজকের বাণী — " + bani.q + " উৎস: " + bani.r, lang:"bn" }]
    };
  }

  /* ৬. আজকের আমল */
  if (/আমল/.test(qn) && /আজকের|আজ/.test(qn)){
    const day = AMOL[new Date().getDay()];
    const items = day.items.map((a,i) => "<li>" + a.t + "</li>").join("");
    return {
      title:"আজকের গুরুত্বপূর্ণ আমল",
      html:`<div class="qa-card"><p class="qa-dim">${day.note}</p><ol>${items}</ol></div>`,
      segments:[{ t:"আজকের আমলগুলো — " + day.items.map(a=>a.t).join(", "), lang:"bn" }]
    };
  }

  /* ৭. দোয়া-সার্চ */
  if (/দোয়া|দোআ|( ||^)dua( |$)/.test(qn)){
    const hits = qaSearchPool(qn, "dua");
    if (hits.length){
      const d = hits[0].it;
      const others = hits.slice(1,3).map(h => `<li><b>${h.it.title}</b> — ${h.it.src || ""}</li>`).join("");
      const ucAsked = /উচ্চারণ/.test(qn);
      return {
        title:"মিলে যাওয়া দোয়া — " + d.title,
        html: qaDuaCard(d) + (others ? `<div class="qa-card"><p class="qa-dim">আরও মিলেছে:</p><ul class="qa-mini">${others}</ul></div>` : ""),
        segments:[
          { t:"দোয়া — " + d.title + "।", lang:"bn" },
          ...(ucAsked ? [{ t:"উচ্চারণ — " + d.uc, lang:"bn" }] : []),
          { t:"বাংলা অর্থ — " + d.bn, lang:"bn" },
          ...(d.src ? [{ t:"উৎস: " + d.src, lang:"bn" }] : [])
        ]
      };
    }
    return { title:"দোয়া পাওয়া যায়নি", note:"অন্য কথায় লিখে দেখুন — যেমন: মা-বাবার জন্য দোয়া, অসুস্থতার দোয়া, সফরের দোয়া।", html:"" };
  }

  /* ৮. হাদিস-সার্চ */
  if (/হাদিস|hadith/.test(qn)){
    const hits = qaSearchPool(qn, "hadith");
    if (hits.length){
      const h = hits[0].it;
      const others = hits.slice(1,3).map(x => `<li><b>${x.it.topic}</b></li>`).join("");
      return {
        title:"মিলে যাওয়া হাদিস — " + h.topic,
        html: qaHadithCard(h) + (others ? `<div class="qa-card"><p class="qa-dim">আরও মিলেছে:</p><ul class="qa-mini">${others}</ul></div>` : ""),
        segments:[
          { t:"হাদিসের বিষয় — " + h.topic + "।", lang:"bn" },
          { t:"অর্থ — " + h.bn, lang:"bn" },
          ...(h.src ? [{ t:"উৎস: " + h.src, lang:"bn" }] : []),
          ...(h.disc && h.disc[0] ? [{ t:"ব্যাখ্যা — " + h.disc[0], lang:"bn" }] : [])
        ]
      };
    }
    return { title:"হাদিস পাওয়া যায়নি", note:"অন্য কথায় লিখে দেখুন — যেমন: নিয়ত নিয়ে হাদিস, দানের ফজিলত হাদিস।", html:"" };
  }

  /* ৯. সার্বিক সার্চ (দোয়া + হাদিস + বাণী + আমল) */
  const hits = qaSearchPool(qn, "any");
  if (hits.length){
    const h0 = hits[0];
    const listHtml = hits.slice(0,3).map(h => {
      if (h.type === "dua") return `<li><b>দোয়া:</b> ${h.it.title} — ${h.it.src || ""}</li>`;
      if (h.type === "hadith") return `<li><b>হাদিস:</b> ${h.it.topic}</li>`;
      if (h.type === "bani") return `<li><b>বাণী:</b> “${h.it.q}” (${h.it.r})</li>`;
      return `<li><b>আমল:</b> ${h.it.t}</li>`;
    }).join("");
    let seg = "আপনার প্রশ্নের সাথে সবচেয়ে বেশি মিলেছে — ";
    if (h0.type === "dua") seg += "দোয়া: " + h0.it.title + " — " + h0.it.bn;
    else if (h0.type === "hadith") seg += "হাদিস: " + h0.it.topic + " — " + h0.it.bn;
    else if (h0.type === "bani") seg += "বাণী: " + h0.it.q;
    else seg += h0.it.t + " — " + (h0.it.d || "");
    return {
      title:"আপনার প্রশ্নের উত্তর",
      html: (h0.type === "dua" ? qaDuaCard(h0.it) : h0.type === "hadith" ? qaHadithCard(h0.it)
           : `<div class="qa-card"><p class="qa-quote">“${h0.it.q || h0.it.t}”</p><p class="qa-dim">${h0.it.r || h0.it.d || ""}</p></div>`)
          + `<div class="qa-card"><p class="qa-dim">সম্পর্কিত আরও ফলাফল:</p><ul class="qa-mini">${listHtml}</ul></div>`,
      segments:[{ t:seg, lang:"bn" }]
    };
  }

  return {
    title:"প্রশ্নটি বুঝতে পারিনি",
    note:"চেষ্টা করুন — যেমন: “সূরা আল-ইমরানের বাংলা অনুবাদ পড়ে শোনাও”, “আয়াতুল কুরসি শোনাও”, “মা-বাবার দোয়া”, “আজকের নামাজের সময়”, “নিয়ত নিয়ে হাদিস”",
    html:""
  };
}

/* -------------------- সার্চ-সাথী -------------------- */
function qaSearchPool(qn, pool){
  const toks = qaTokens(qn).filter(t => !/দোয়া|দোআ|হাদিস/.test(t));
  if (!toks.length) return [];
  const out = [];
  const add = (it, hay, type) => {
    const H = qaNorm(hay);
    let sc = 0;
    toks.forEach(t => { if (H.includes(t)) sc += (t.length >= 3 ? 2 : 1); });
    if (toks.length > 1){
      const compactHit = H.replace(/\s+/g,"");
      toks.forEach((t,i) => { if (i < toks.length-1 && compactHit.includes(t)) sc += 0.2; });
    }
    if (sc > 1) out.push({ it, type, sc: sc + (it._boost || 0) });
  };
  if (pool === "dua" || pool === "any"){
    DUAS.forEach(d => add(d, d.title + " " + d.bn, "dua"));
  }
  if (pool === "hadith" || pool === "any"){
    HADITHS.forEach(h => add(h, h.topic + " " + h.bn + " " + (h.narrator || ""), "hadith"));
  }
  if (pool === "any"){
    DAILY_BANI.forEach(b => add(b, b.q + " " + b.r, "bani"));
    const day = AMOL[new Date().getDay()];
    day.items.forEach(a => add(a, a.t + " " + a.d, "amol"));
    if (typeof AMOL_DETAIL !== "undefined"){
      Object.keys(AMOL_DETAIL).forEach(k => { const dd = AMOL_DETAIL[k]; add({ t:k, d:dd.g + " " + dd.f }, k + " " + dd.g + " " + dd.f, "amol"); });
    }
  }
  out.sort((a,b) => b.sc - a.sc);
  return out;
}

function qaDuaCard(d){
  return `
  <div class="qa-card">
    <h4 class="qa-card-h">${d.title}</h4>
    <p class="ar qa-ar" lang="ar">${d.ar}</p>
    <p class="uc"><i>উচ্চারণ</i>${d.uc}</p>
    <p class="bn"><i>অর্থ</i>${d.bn}</p>
    ${d.src ? `<p class="qa-dim">${d.src}</p>` : ""}
  </div>`;
}
function qaHadithCard(h){
  return `
  <div class="qa-card">
    <h4 class="qa-card-h">${h.topic}</h4>
    <p class="ar qa-ar" lang="ar">${h.ar}</p>
    <p class="uc"><i>উচ্চারণ</i>${h.uc || ""}</p>
    <p class="bn"><i>অর্থ</i>${h.bn}</p>
    <p class="qa-dim">${h.narrator || ""} — ${h.src || ""}</p>
    ${h.disc && h.disc.length ? `<p class="qa-disc">${h.disc[0]}</p>` : ""}
  </div>`;
}

/* -------------------- পেজ UI -------------------- */
function pageAsk(){
  const chips = [
    "সূরা আল-ফাতিহার বাংলা অনুবাদ পড়ে শোনাও",
    "আয়াতুল কুরসি শোনাও",
    "সূরা ইয়াসিনের অনুবাদ শোনাও",
    "সূরা বাকারার ২৮৫-২৮৬ আয়াত শোনাও",
    "সূরা ইখলাসের উচ্চারণ শোনাও",
    "মা-বাবার জন্য দোয়া",
    "আজকের নামাজের সময় কটা",
    "আজ কয় তারিখ",
    "দানের ফজিলত নিয়ে হাদিস",
    "আজকের বাণী শোনাও"
  ].map(c => `<button class="qa-chip" data-qa-chip="${c}">${c}</button>`).join("");

  return `
  <div class="page pg-ask">
    <div class="sec-head" style="margin-top:14px">
      <h2>অনুসন্ধান <small>জিজ্ঞেস করুন — উত্তর লেখায় দেখুন, কণ্ঠে শুনুন</small></h2>
      <span class="rule"></span>
    </div>

    <section class="ask-box pattern">
      <textarea id="askInput" class="ask-input" rows="2" placeholder="যে কোনো প্রশ্ন লিখুন বা বলুন — যেমন: সূরা আল-ইমরানের বাংলা অনুবাদ পড়ে শোনাও…"></textarea>
      <div class="ask-controls">
        <label class="ask-lang-wrap" id="askLangWrap">
          <span>🎙 ভাষা</span>
          <select id="askLang" class="ask-lang">
            <option value="bn-BD" selected>বাংলা</option>
            <option value="ar-SA">আরবি</option>
            <option value="en-US">English</option>
            <option value="hi-IN">हिन্দी</option>
          </select>
        </label>
        <button class="ask-mic" id="askMic" title="চেপে ধরে বলুন বা একবার চেপে ছেড়ে দিয়ে বলুন" aria-label="ভয়েস ইনপুট">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>
        </button>
        <button class="ask-go" id="askGo">${I.search} অনুসন্ধান করুন</button>
      </div>
      <p class="ask-micstat" id="askMicStat" hidden>🎙 শুনছি — বলুন, থামলে আমি ফলাফল এনে দেব…</p>
      <p class="ask-nosr" id="askNoSR" hidden>আপনার এই ব্রাউজার/ডিভাইসে ভয়েস-ইনপুট নেই — টাইপ করে ব্যবহার করুন।</p>
    </section>

    <div class="ask-chips">${chips}</div>

    <div id="askWave" class="ask-wave" hidden></div>
    <div id="askResult"></div>

    <section class="azan-note pattern" style="margin-top:16px">
      <p><b>কীভাবে কাজ করে:</b> অ্যাপের ভেতরের কুরআন (আরবি, বাংলা অনুবাদ, বাংলা উচ্চারণ), দোয়া, হাদিস, বাণী, আমল ও সময়সূচি — এসব থেকেই আপনার প্রশ্নের উত্তর খুঁজে নিয়ে লেখায় দেখা এবং (ডিভাইসে সুবিধা থাকলে) কণ্ঠে পড়েও শোনানো হয়। ফলাফল আরও ভালো করতে প্রশ্নে সূরা/আয়াত/বিষয়ের নাম সুনির্দিষ্টভাবে বলুন বা লিখুন।</p>
    </section>
  </div>`;
}

/* -------------------- ভয়েস-ইনপুট (স্পিচ রিকগনিশন) -------------------- */
let qaRec = null, qaListening = false, qaVoiceInputUsed = false;
function qaInitVoice(){
  const mic = $("#askMic"); if (!mic) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const nosr = $("#askNoSR"), langWrap = $("#askLangWrap");
  if (!SR){
    mic.hidden = true;
    if (langWrap) langWrap.hidden = true;
    if (nosr) nosr.hidden = false;
    return;
  }
  mic.addEventListener("click", ()=>{
    if (qaListening){ try{ qaRec.stop(); }catch(e){} return; }
    qaStartListening();
  });
}
function qaStartListening(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  const mic = $("#askMic"), stat = $("#askMicStat"), wave = $("#askWave");
  const inp = $("#askInput");
  const langSel = $("#askLang");
  try { qaRec && qaRec.abort(); } catch(e){}
  qaRec = new SR();
  qaRec.lang = langSel ? langSel.value : "bn-BD";
  qaRec.interimResults = true;
  qaRec.continuous = false;
  qaRec.maxAlternatives = 1;
  let finalTxt = "";
  qaRec.onstart = ()=>{
    qaListening = true;
    qaVoiceInputUsed = true;
    if (mic) mic.classList.add("live");
    if (stat) stat.hidden = false;
    if (wave) wave.hidden = false;
  };
  qaRec.onresult = (ev)=>{
    let interim = "";
    for (let i = ev.resultIndex; i < ev.results.length; i++){
      const tr = ev.results[i][0].transcript;
      if (ev.results[i].isFinal) finalTxt += (finalTxt ? " " : "") + tr;
      else interim += tr;
    }
    if (inp) inp.value = (finalTxt + (interim ? " " + interim : "")).trim();
  };
  qaRec.onerror = ()=>{
    if (stat){ stat.textContent = "শুনতে পাইনি — আবার ছোট্ট করে বলুন।"; setTimeout(()=>{ stat.hidden = true; }, 2600); }
  };
  qaRec.onend = ()=>{
    qaListening = false;
    if (mic) mic.classList.remove("live");
    if (wave) wave.hidden = true;
    if (stat) stat.hidden = true;
    if (finalTxt.trim()){
      qaSubmit();
    }
  };
  try { qaRec.start(); } catch(e){}
}

/* -------------------- সাবমিট ও বাইন্ড -------------------- */
let qaBusy = false;
function qaSubmit(forced){
  const inp = $("#askInput");
  const raw = forced !== undefined ? String(forced) : (inp ? inp.value : "");
  const qn = qaNorm(raw);
  if (!qn){
    const box = $("#askResult");
    if (box) box.innerHTML = `<section class="qa-ans"><p class="qa-note">আগে প্রশ্নটি লিখুন বা বলুন।</p></section>`;
    return;
  }
  if (qaBusy) return;
  qaBusy = true;
  qaStopSpeech();
  const box = $("#askResult");
  if (box) box.innerHTML = `<section class="qa-ans"><p class="qa-note">✨ প্রশ্নটি সারা-অ্যাপের জ্ঞানভান্ডারে খোঁজা হচ্ছে…</p></section>`;
  const res = qaAnswer(raw);
  if (res === null){ qaBusy = false; return; } /* পরের অংশ — qaContinueLast নিজেই রেন্ডার করে */
  const wOnly = /শুধু লিখে|কেবল লিখে|লিখে দাও|লিখে দিন|লেখা দেখাও/.test(qn) && !/শোনাও|শুনাও|শোনান|পড়ে/.test(qn);
  Promise.resolve(res)
    .then(r => { qaRenderRes(r, !wOnly); qaBusy = false; })
    .catch(() => {
      qaRenderRes({ title:"দুঃখিত", note:"উত্তরটি এই মুহূর্তে আনা যায়নি — ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।", html:"" }, false);
      qaBusy = false;
    });
}

function bindAsk(){
  if (!$("#askGo")) return;
  $("#askGo").addEventListener("click", ()=>qaSubmit());
  const inp = $("#askInput");
  if (inp) inp.addEventListener("keydown", (e)=>{
    if (e.key === "Enter" && !e.shiftKey){ e.preventDefault(); qaSubmit(); }
  });
  document.querySelectorAll(".qa-chip").forEach(c =>
    c.addEventListener("click", ()=>{
      const t = c.dataset.qaChip;
      const i2 = $("#askInput"); if (i2) i2.value = t;
      qaSubmit(t);
    })
  );
  qaInitVoice();
}

/* -------------------- বুট-নিশ্চিতকরণ --------------------
   app.js নিজের শেষেই প্রথম render() চালায় — সেসময় qa.js এখনো লোড হয়নি
   (index.html-এ qa.js আসে app.js-এর পরে)। তাই লোড শেষে অবস্থান অনুযায়ী
   আবার একবার পেজ আঁকাই — আইডেম্পোটেন্ট, নিরাপদ। */
try {
  if (typeof render === "function"){ render(); }
} catch(e){ if (typeof console !== "undefined") console.warn("qa boot render:", e); }
