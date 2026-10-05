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

const QA_S_KEYS = Object.keys(QA_S_ALIASES).sort((a,b) => b.length - a.length);

const QA_BN_NUM = {
  "প্রথম":1,"প্রথমটি":1,"১ম":1,"দ্বিতীয়":2,"তৃতীয়":3,"চতুর্থ":4,"পঞ্চম":5,"ষষ্ঠ":6,"সপ্তম":7,"অষ্টম":8,"নবম":9,"দশম":10,
  "এক":1,"দুই":2,"তিন":3,"চার":4,"পাঁচ":5,"ছয়":6,"সাত":7,"আট":8,"নয়":9,"দশ":10,
  "এগারো":11,"বারো":12,"তেরো":13,"চোদ্দ":14,"পনেরো":15,"ষোল":16,"ষোলো":16,"সতেরো":17,"আঠারো":18,"ঊনিশ":19,"উনিশ":19,"কুড়ি":20,"বিশ":20,
  "একুশ":21,"বাইশ":22,"তেইশ":23,"চব্বিশ":24,"পঁচিশ":25,"ছাব্বিশ":26,"সাতাশ":27,"আটাশ":28,"ঊনত্রিশ":29,"ত্রিশ":30
};

/* প্রশ্ন থেকে আয়াত-চাহিদা বের করা — এটাই প্রথমে হয়, যাতে আয়াতের সংখ্যাটা সূরার নম্বর না হয়ে যায় */
function qaExtractAyahReq(qn){
  let wanted = /আয়াত/.test(qn);
  let fromA = 0, toA = 0;
  let clipped = qn;
  const take = (m, a, b) => { fromA = a; toA = b; clipped = (clipped.slice(0, m.index) + " " + clipped.slice(m.index + m[0].length)).replace(/\s+/g, " ").trim(); };
  let m = clipped.match(/(\d{1,3})\s*(?:থেকে|পর্যন্ত)\s*(\d{1,3})\s*আয়াত?/);
  if (!m) m = clipped.match(/আয়াত\s*(?:নম্বর|নং)?\s*(\d{1,3})\s*(?:থেকে|পর্যন্ত)\s*(\d{1,3})/);
  if (m){ wanted = true; take(m, +m[1], +m[2]); }
  else {
    m = clipped.match(/(\d{1,3})\s+(?:ও|এবং|,)?\s*(\d{1,3})\s*আয়াত?/);
    if (m){ wanted = true; take(m, +m[1], +m[2]); }
    else {
      m = clipped.match(/(\d{1,3})\s*(?:নম্বর|নং|তম)?\s*আয়াত?/) || clipped.match(/আয়াত\s*(?:নম্বর|নং)?\s*(\d{1,3})/);
      if (m){ wanted = true; take(m, +m[1], +m[1]); }
      else {
        /* শেষ আয়াত */
        const msh = clipped.match(/শেষ\s*আয়াত/);
        if (msh){ wanted = true; take(msh, -1, -1); }
        else {
          /* শব্দে লেখা সংখ্যা/ক্রমবাচক */
          for (const w in QA_BN_NUM){
            const rx = new RegExp("(^|\\s)" + w + "(?:টি|টা)?(?:\\s*(?:নম্বর|নং))?\\s*আয়াত|আয়াত\\s*" + w + "(\\s|$)");
            const mm = clipped.match(rx);
            if (mm){ wanted = true; take(mm, QA_BN_NUM[w], QA_BN_NUM[w]); break; }
          }
        }
      }
    }
  }
  return { wanted, fromA, toA, clipped };
}

function qaFindSurah(qn){
  /* স্পষ্ট "সূরা নম্বর ৩" / "৩ নং সূরা" — আয়াত-অংশ আগেই বাদ পড়েছে বলে এখানে নিরাপদ */
  let m = qn.match(/সূরা[হ]?\s*(?:নম্বর|নং)\s*(\d{1,3})/) || qn.match(/(\d{1,3})\s*(?:নম্বর|নং)?\s*সূরা[হ]?\b/);
  if (m){ const n = +(m[1] || m[2]); if (n >= 1 && n <= 114) return { n }; }
  /* নাম-দেখে — দীর্ঘ আলিয়াস আগে */
  const compact = qn.replace(/\s+/g, "");
  for (const k of QA_S_KEYS){
    if (compact.includes(k)) return { n: QA_S_ALIASES[k] };
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
const qaSpeech = { list:[], idx:0, playing:false, paused:false, errs:0, engine:"none", last:null };
const qaAudio = { el:null, retried:0 };

function qaSupportsTTS(){ return typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function"; }
function qaVoicesNow(){ try { return qaSupportsTTS() ? window.speechSynthesis.getVoices() : []; } catch(e){ return []; } }
function qaHasVoice(langPrefix){
  const lp = langPrefix.toLowerCase();
  return qaVoicesNow().some(v => v && v.lang && v.lang.toLowerCase().replace(/_/g,"-").startsWith(lp));
}
/* অনলাইন কণ্ঠ-ইঞ্জিন (Google Translate TTS) — ডিভাইসে বাংলা/আরবি ভয়েস না থাকলেও
   প্রায় সব ব্রাউজার/ফোনে কাজ করে; ইন্টারনেট প্রয়োজন */
function qaSupportsGTTS(){ return typeof window !== "undefined" && typeof window.Audio === "function"; }
function qaTtsUrl(txt, lang){
  return "https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=" + (lang === "ar" ? "ar" : "bn") + "&q=" + encodeURIComponent(txt);
}
function qaChunkForGT(txt, lim){
  lim = lim || 165;
  const sents = String(txt).match(/[^।.!?\n]{1,1}[^।.!?\n]*[।.!?]?/g) || [txt];
  const out = []; let cur = "";
  for (let s of sents){
    s = s.trim(); if (!s) continue;
    while (s.length > lim){ const cut = s.lastIndexOf(" ", lim); out.push(s.slice(0, cut > 60 ? cut : lim)); s = s.slice(cut > 60 ? cut : lim).trim(); }
    if ((cur + " " + s).trim().length <= lim) cur = cur ? cur + " " + s : s;
    else { if (cur) out.push(cur); cur = s; }
  }
  if (cur) out.push(cur);
  return out;
}
function qaIsWebView(){
  try { return /;\s*wv\)|Version\/4\.0 Chrome\//.test(navigator.userAgent) || typeof window.AndroidQASR !== "undefined"; }
  catch(e){ return false; }
}
function qaTtsPref(){
  try { return localStorage.getItem("qh.ttsEngine") || "auto"; } catch(e){ return "auto"; } /* auto | online | device */
}
function qaChooseEngine(){
  const pref = qaTtsPref();
  if (pref === "online"){ if (qaSupportsGTTS()) return "gt"; return qaSupportsTTS() ? "ws" : "none"; }
  if (pref === "device"){ if (qaSupportsTTS()) return "ws"; return qaSupportsGTTS() ? "gt" : "none"; }
  /* সয়ংক্রিয়: ওয়েবভিউ/বাংলা-ভয়েসবিহীন ডিভাইসে অনলাইন ইঞ্জিন আগে */
  if (qaIsWebView() && qaSupportsGTTS()) return "gt";
  if (qaSupportsTTS() && qaHasVoice("bn")) return "ws";
  if (qaSupportsGTTS()) return "gt";
  if (qaSupportsTTS()) return "ws";
  return "none";
}
function qaStopSpeech(){
  if (typeof qaDisarmWatchdog === "function") qaDisarmWatchdog();
  qaSpeech.list = []; qaSpeech.idx = 0; qaSpeech.playing = false; qaSpeech.paused = false;
  if (qaSupportsTTS()){ try { window.speechSynthesis.cancel(); } catch(e){} }
  if (qaAudio.el){ try { qaAudio.el.onended = null; qaAudio.el.onerror = null; qaAudio.el.pause(); qaAudio.el.src = ""; } catch(e){} }
  qaPlayerUpdate();
}
if (typeof window !== "undefined" && qaSupportsTTS()){
  try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = function(){}; } catch(e){}
}

function qaSegmentsSpeak(list){
  qaSpeech.engine = qaChooseEngine();
  if (qaSpeech.engine === "gt"){
    /* অনলাইন ইঞ্জিনের অনুরোধ সীমায় ছোট ছোট করে ভাঙি */
    qaSpeech.list = (list || []).reduce((acc, seg) => {
      qaChunkForGT(seg.t).forEach(p => acc.push({ t: p, lang: seg.lang }));
      return acc;
    }, []);
  } else {
    qaSpeech.list = (list || []).slice();
  }
  qaSpeech.idx = 0;
  qaSpeech.errs = 0;
  qaPlayerUpdate();
  if (qaSpeech.list.length) qaPlayCurrent();
}
function qaPlayCurrent(){
  if (qaSpeech.idx >= qaSpeech.list.length){ qaSpeech.playing = false; qaSpeech.paused = false; qaPlayerUpdate(); return; }
  if (qaSpeech.engine === "gt"){ qaPlayCurrentGT(); return; }
  if (qaSpeech.engine === "ws"){ qaPlayCurrentWS(); return; }
  qaSpeech.playing = false; qaPlayerUpdate();
}

/* --- ইঞ্জিন ১: ডিভাইসের speechSynthesis (অফলাইন) --- */
let qaWatchdog = null;
function qaArmWatchdog(seg){
  /* কিছু পরিবেশে (বিশেষত অ্যান্ড্রয়েড ওয়েবভিউ) speechSynthesis কোনো শব্দই না
     করে এবং কোনো ইভেন্টও ছোড়ে না — সময় দেখে বুঝে নিয়ে অনলাইনে সরে যাই */
  if (qaWatchdog) clearTimeout(qaWatchdog);
  const waitMs = Math.min(16000, 2500 + String(seg.t).length * 95);
  qaWatchdog = setTimeout(()=>{
    qaWatchdog = null;
    if (!qaSpeech.playing || qaSpeech.engine !== "ws") return;
    try {
      if (qaSupportsTTS() && window.speechSynthesis.speaking){ /* শব্দ হচ্ছে — অপেক্ষাই করি */ return; }
    } catch(e){}
    /* নীরব ব্যর্থতা — GT-তে চলে যাই */
    if (qaSupportsGTTS()) qaSwitchToGTFromHere();
    else { qaSpeech.playing = false; qaPlayerUpdate(); }
  }, waitMs);
}
function qaDisarmWatchdog(){ if (qaWatchdog){ clearTimeout(qaWatchdog); qaWatchdog = null; } }

function qaPlayCurrentWS(){
  if (!qaSupportsTTS()){ qaSpeech.playing = false; qaPlayerUpdate(); return; }
  const seg = qaSpeech.list[qaSpeech.idx];
  const u = new window.SpeechSynthesisUtterance(seg.t);
  u.lang = seg.lang === "ar" ? "ar-SA" : (seg.lang === "en" ? "en-US" : "bn-BD");
  u.rate = seg.lang === "ar" ? 0.85 : 0.95;
  u.pitch = 1;
  window.speechSynthesis.cancel();
  qaSpeech.playing = true; qaSpeech.paused = false;
  qaPlayerUpdate(seg);
  qaArmWatchdog(seg);
  u.onend = function(){
    qaDisarmWatchdog();
    qaSpeech.idx++;
    qaPlayCurrent();
  };
  u.onerror = function(e){
    qaDisarmWatchdog();
    const kind = e && e.error ? String(e.error) : "";
    if (kind === "canceled" || kind === "interrupted"){ return; }
    qaSpeech.errs++;
    /* স্থানীয় কণ্ঠে দুইবার ব্যর্থ — অনলাইন ইঞ্জিনে সয়ংক্রিয় চলে যাই */
    if (qaSpeech.errs >= 2 && qaSupportsGTTS()){
      qaSwitchToGTFromHere();
      return;
    }
    qaSpeech.idx++;
    qaPlayCurrent();
  };
  try { window.speechSynthesis.speak(u); } catch(e){
    qaDisarmWatchdog();
    if (qaSupportsGTTS()) qaSwitchToGTFromHere();
    else { qaSpeech.playing = false; qaPlayerUpdate(); }
  }
}
function qaSwitchToGTFromHere(){
  if (!qaAudio.el){ /* এখান থেকে অবশিষ্টাংশ অনলাইন ইঞ্জিনে */ }
  const done = qaSpeech.list.slice(0, qaSpeech.idx);
  const rest = qaSpeech.list.slice(qaSpeech.idx);
  const restFlat = [];
  rest.forEach(seg => qaChunkForGT(seg.t).forEach(p => restFlat.push({ t: p, lang: seg.lang })));
  qaSpeech.list = done.concat(restFlat);
  qaSpeech.engine = "gt";
  qaPlayCurrent();
}

/* --- ইঞ্জিন ২: অনলাইন Google TTS অডিও --- */
function qaPlayCurrentGT(){
  const seg = qaSpeech.list[qaSpeech.idx];
  if (!qaAudio.el) qaAudio.el = new window.Audio();
  const el = qaAudio.el;
  el.onended = null; el.onerror = null;
  try { el.pause(); } catch(e){}
  el.src = qaTtsUrl(seg.t, seg.lang);
  qaAudio.retried = 0;
  qaSpeech.playing = true; qaSpeech.paused = false;
  qaPlayerUpdate(seg);
  el.onended = function(){
    qaAudio.gtfails = 0;
    qaSpeech.idx++;
    qaPlayCurrent();
  };
  el.onerror = function(){
    qaAudio.retried++;
    if (qaAudio.retried <= 1){ setTimeout(()=>{ try{ el.src = qaTtsUrl(seg.t, seg.lang); const p2 = el.play(); if (p2 && p2.catch) p2.catch(()=>{}); }catch(e){} }, 900); return; }
    /* এই খণ্ডটি বাদ দিয়ে পরেরটা চেষ্টা করি; টানা ৩টি ব্যর্থ হলে থেমে এলার্ট */
    qaAudio.gtfails = (qaAudio.gtfails || 0) + 1;
    if (qaAudio.gtfails >= 3){
      qaSpeech.playing = false;
      const now2 = $("#qaNow");
      if (now2) now2.innerHTML = "⚠️ অনলাইন কণ্ঠ-ইঞ্জিনে পৌঁছানো যাচ্ছে না — ইন্টারনেট সংযোগ দেখে আবার ▶ চাপুন।";
      return;
    }
    qaSpeech.idx++;
    qaPlayCurrent();
  };
  const pr = el.play();
  if (pr && pr.catch) pr.catch(err => {
    const name = (err && err.name) || "";
    if (name === "NotAllowedError"){
      /* ব্রাউজার সয়ংক্রিয় অডিওর অনুমতি চায় — ব্যবহারকারীকে বাটনে ঠেলামর */
      qaSpeech.playing = false; qaSpeech.paused = false;
      const nowEl = $("#qaNow");
      if (nowEl) nowEl.innerHTML = "কণ্ঠ শুরু করতে ▶ <b>শুনুন</b>-এ একবার চাপুন (ব্রাউজারের অনুমতি দরকার)।";
      qaPlayerUpdate(seg);
      return;
    }
    if (el.onerror) el.onerror();
  });
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
  const hasSegs = !!(res.segments && res.segments.length);
  const engine = hasSegs ? qaChooseEngine() : "none";
  const ttsOK = engine !== "none";
  const vwarn = (engine === "gt") ?
    `<p class="qa-vwarn">ℹ️ এই ডিভাইসে স্থানীয় বাংলা কণ্ঠ নেই, তাই শোনানো হচ্ছে অনলাইন কণ্ঠ-ইঞ্জিনে — ইন্টারনেট সংযুক্ত রাখুন। (<span class="qa-mono">▶ শুনুন</span> চাপলেই শুরু)</p>` : "";
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
      </div>
    ${vwarn}` : `<p class="qa-note">এই পরিবেশে কণ্ঠে শোনানো যাচ্ছে না — লেখাটি নিচে পড়ুন।</p>`) : ""}
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
    if (qaSpeech.engine === "gt"){
      if (!qaAudio.el) return;
      if (qaSpeech.paused){ const pr = qaAudio.el.play(); if (pr && pr.catch) pr.catch(()=>{}); qaSpeech.paused = false; pz.innerHTML = I.pause + " বিরতি"; }
      else { qaAudio.el.pause(); qaSpeech.paused = true; pz.innerHTML = I.play + " চালিয়ে যান"; }
      return;
    }
    if (!qaSupportsTTS()) return;
    if (qaSpeech.paused){ window.speechSynthesis.resume(); qaSpeech.paused = false; pz.innerHTML = I.pause + " বিরতি"; }
    else { window.speechSynthesis.pause(); qaSpeech.paused = true; pz.innerHTML = I.play + " চালিয়ে যান"; }
  });
  const sb = $("#qaStopB");
  if (sb) sb.addEventListener("click", qaStopSpeech);

  const mb = $("#qaMoreBtn");
  if (mb) mb.addEventListener("click", ()=>{ qaContinueLast(); });

  if (autoSpeak && res.segments && res.segments.length && engine !== "none"){
    qaSegmentsSpeak(res.segments);
  } else {
    qaSpeech.list = res.segments ? res.segments.slice() : [];
    qaSpeech.idx = 0; qaSpeech.playing = false;
    qaPlayerUpdate();
  }
  try { box.scrollIntoView({ behavior:"smooth", block:"start" }); } catch(e){}
}

/* -------------------- কুরআন-ইনটেন্ট মোড -------------------- */
function qaModeFrom(qn, fallback){
  const wantAr = /আরবি|তিলাওয়াত|তেলাওয়াত|tilawat|recite|arabic|قر/.test(qn);
  const wantUc = /উচ্চারণ|উচারণ|শুদ্ধ|pronunciation/.test(qn);
  const wantBn = /অনুবাদ|অর্থ|ভাবার্থ|বাংলা|translation/.test(qn);
  let parts = [];
  if (wantAr) parts.push("ar");
  if (wantUc) parts.push("uc");
  if (wantBn) parts.push("bn");
  if (!parts.length) parts = fallback || ["ar","bn"];
  return parts;
}

const QA_READ_CHUNK = 15;
let qaLast = null; /* { n, next, mode } — পরের অংশ চালিয়ে যাওয়ার অবস্থা */

function qaAyahCard(n, a, i, parts){
  parts = parts || ["ar","uc","bn"];
  return `
  <article class="ayah">
    <div class="badge-row"><span class="ayah-badge">৲ ${bn(i)}</span></div>
    ${parts.includes("ar") ? `<p class="ar" lang="ar">${a.ar}</p>` : ""}
    ${parts.includes("uc") ? `<p class="uc"><i>উচ্চারণ</i>${a.uc}</p>` : ""}
    ${parts.includes("bn") ? `<p class="bn"><i>অনুবাদ</i>${a.bn}</p>` : ""}
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
    for (let i = from; i <= planTo; i++) cards.push(qaAyahCard(surahNo, list[i-1], i, parts));
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


/* -------------------- কুরআন-সংক্রান্ত সাধারণ জ্ঞান (অ্যাপ-ডেটা থেকে হিসাব) -------------------- */
function qaQuranStats(){
  const suras = SURAH_META.length;
  const ayahs = SURAH_META.reduce((s, m) => s + m[4], 0);
  const madani = SURAH_META.filter(m => m[5] === 1).length;
  const longest = SURAH_META.reduce((a, b) => (b[4] > a[4] ? b : a));
  const minLen = Math.min.apply(null, SURAH_META.map(m => m[4]));
  const shorts = SURAH_META.filter(m => m[4] === minLen);
  return { suras, ayahs, madani, makki: suras - madani, longest, minLen, shorts };
}
const QA_PROPHETS = ["আদম","ইদরিস","নূহ","হুদ","সালেহ","লুত","ইব্রাহিম","ইসমাইল","ইসহাক","ইয়াকুব","ইউসুফ","শোয়াইব","আইয়ুব","যুলকিফল","মুসা","হারুণ","দাউদ","সুলাইমান","ইলিয়াস","আল-ইয়াসা","ইউনুস","যাকারিয়া","ইয়াহ্যা","ঈসা","মুহাম্মাদ (সা.)"];
const QA_PROP_SURAS = [10, 11, 12, 14, 47, 71]; /* ইউনুস, হুদ, ইউসুফ, ইব্রাহিম, মুহাম্মদ, নূহ */

function qaStatsAnswer(qn){
  const scope = /কুরআন|কোরআন|কালাম|মজিদ/.test(qn);
  const asksCount = /কত|কয়/.test(qn);
  const st = qaQuranStats();

  /* পাড়া */
  if (/পাড়া|পারা/.test(qn) && asksCount){
    const txt = "পবিত্র কুরআন ৩০টি পাড়ায় (জুজ) বিভক্ত — প্রথম পাড়া “আলিফ লাম মীম” (সূরা ফাতিহা থেকে) এবং শেষ পাড়া “আম্মা” (সূরা নাবা থেকে)।";
    return { title:"কুরআনের পাড়া", html:`<div class="qa-card"><p>${txt}</p></div>`, segments:[{ t:txt, lang:"bn" }] };
  }
  /* সূরার সংখ্যা */
  if (asksCount && /সূরা/.test(qn) && !qaFindSurah(qaExtractAyahReq(qn).clipped)){
    const txt = "পবিত্র কুরআনে মোট ১১৪টি সূরা আছে। এর মধ্যে মাক্কি সূরা " + bn(st.makki) + "টি এবং মাদানি সূরা " + bn(st.madani) + "টি। মোট আয়াত " + bn(st.ayahs) + "টি এবং ৩০টি পাড়ায় বিভক্ত।";
    const html = `<div class="qa-card">
      <p class="qa-quote">পবিত্র কুরআনে সূরা রয়েছে — <b style="font-size:1.2em;color:var(--gold)">১১৪টি</b></p>
      <p class="qa-dim">• মাক্কি সূরা — ${bn(st.makki)}টি (হিজরতের আগে নাজিল)<br>• মাদানি সূরা — ${bn(st.madani)}টি (হিজরতের পরে নাজিল)<br>• মোট আয়াত — ${bn(st.ayahs)}টি  •  পাড়া — ৩০টি</p>
    </div>`;
    return { title:"কুরআনে সূরার সংখ্যা", html, segments:[{ t:txt, lang:"bn" }] };
  }
  /* আয়াতের সংখ্যা */
  if (asksCount && /আয়াত/.test(qn) && scope && !qaFindSurah(qaExtractAyahReq(qn).clipped)){
    const txt = "পবিত্র কুরআনে মোট " + bn(st.ayahs) + "টি আয়াত। সবচেয়ে বেশি আয়াতবিশিষ্ট সূরা আল-বাকারা — ২৮৬ আয়াত।";
    return { title:"কুরআনে আয়াতের সংখ্যা", html:`<div class="qa-card"><p>${txt}</p></div>`, segments:[{ t:txt, lang:"bn" }] };
  }
  /* সবচেয়ে বড়/ছোট সূরা */
  if (scope && /বড়|বৃহত্তম|দীর্ঘতম|লম্বা|বেশি আয়াত/.test(qn) && /সূরা/.test(qn)){
    const m = st.longest;
    const txt = "আয়াত-সংখ্যায় কুরআনের সবচেয়ে বড় সূরা — সূরা " + m[2] + " (" + bn(m[4]) + " আয়াত)। এটি কুরআনের " + bn(m[0]) + " নম্বর সূরা।";
    return { title:"সবচেয়ে বড় সূরা", html:`<div class="qa-card"><p class="qa-quote">${m[2]}</p><p class="qa-dim">${bn(m[4])} আয়াত • ${bn(m[0])} নম্বর সূরা</p></div>`, segments:[{ t:txt, lang:"bn" }] };
  }
  if (scope && /ছোট|ক্ষুদ্রতম|সংক্ষিপ্ততম|কম আয়াত/.test(qn) && /সূরা/.test(qn)){
    const names = st.shorts.map(m => m[2]).join(", ");
    const txt = "আয়াত-সংখ্যায় কুরআনের সবচেয়ে ছোট সূরাগুলোর প্রতিটিতে মাত্র " + bn(st.minLen) + "টি আয়াত — সেগুলো হলো: " + names + "।";
    return { title:"সবচেয়ে ছোট সূরা", html:`<div class="qa-card"><p class="qa-quote">${names}</p><p class="qa-dim">প্রতিটিতে মাত্র ${bn(st.minLen)}টি আয়াত</p></div>`, segments:[{ t:txt, lang:"bn" }] };
  }
  /* মাক্কি/মাদানি সংখ্যা */
  if (asksCount && /মাক্কি|মাদানি/.test(qn)){
    const txt = "কুরআনের ১১৪টি সূরার মধ্যে মাক্কি সূরা " + bn(st.makki) + "টি এবং মাদানি সূরা " + bn(st.madani) + "টি।";
    return { title:"মাক্কি-মাদানি সূরা", html:`<div class="qa-card"><p>${txt}</p></div>`, segments:[{ t:txt, lang:"bn" }] };
  }
  /* নবীদের নাম */
  if (/নবী|রসূল|পয়গম্বর/.test(qn) && /কোন কোন|কতজন|কত জন|তালিকা|নামগুলো|নাম আছে|নামসমূহ/.test(qn)){
    const suraNames = QA_PROP_SURAS.map(n => SURAH_META.find(m => m[0] === n)[2]).join(", ");
    const segTxt = "কুরআনে সরাসরি নাম উল্লেখ আছে পঁচিশ জন নবীর। তারা হলেন — " +
      QA_PROPHETS.join(", ") + "। এর মধ্যে মূসা আলাইহিস সালাম-এর নাম সবচেয়ে বেশি বার এসেছে। আর ছয় জন নবীর নামে সূরা আছে — " + suraNames + "।";
    const chips = QA_PROPHETS.map(n => `<span class="qa-chip" style="cursor:default">${n}</span>`).join("");
    const html = `<div class="qa-card">
      <p class="qa-quote">কুরআনে <b style="color:var(--gold)">২৫ জন নবীর</b> নাম সরাসরি উল্লেখ আছে</p>
      <div class="ask-chips" style="margin-top:8px">${chips}</div>
      <p class="qa-dim" style="margin-top:10px">সবচেয়ে বেশি উল্লেখিত নবী — মূসা (আ.)। ছয় জন নবীর নামে সূরা রয়েছে: ${suraNames}।</p>
    </div>`;
    return { title:"কুরআনে উল্লেখিত নবীদের নাম", html, segments: qaTextToBnSegs(segTxt) };
  }
  return null;
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

  /* ৩.৫ কুরআন-সংক্রান্ত সাধারণ জ্ঞান — সূরা-ইনটেন্টের আগে, যাতে "কতটি সূরা"-জাতীয় প্রশ্ন ভুল পথে না যায় */
  {
    const statAns = qaStatsAnswer(qn);
    if (statAns) return statAns;
  }

  /* ৪. সূরা-ইনটেন্ট — আয়াতের অংশ আগে আলাদা, তারপর সূরা খোঁজা; সুনির্দিষ্ট আয়াত বললে শুধু সেটুকুই আনা হয় */
  const ayahInfo = qaExtractAyahReq(qn);
  const sHit = qaFindSurah(ayahInfo.clipped);
  if (sHit || /সূরা|আয়াত|তিলাওয়াত|তেলাওয়াত|কুরান|কুরআন/.test(qn)){
    if (!sHit){
      return { title:"কোন সূরা?", note:"সূরার নাম বা নম্বরটি বলুন — যেমন: সূরা আল-বাকারার ২৫৫ নম্বর আয়াত শোনাও।", html:"" };
    }
    const nS = sHit.n;
    const metaS = SURAH_META.find(m => m[0] === nS);
    const mode = qaModeFrom(qn);
    if (ayahInfo.wanted){
      let f = ayahInfo.fromA, t2 = ayahInfo.toA;
      if (f === -1){ f = metaS[4]; t2 = metaS[4]; } /* শেষ আয়াত */
      if (!f){
        return { title:"কত নম্বর আয়াত?", note:"আয়াতের নম্বরটিও বলুন — যেমন: সূরা " + metaS[2] + "-এর ১০ নম্বর আয়াত শোনাও।", html:"" };
      }
      if (f < 1 || f > metaS[4] || (t2 && (t2 < 1 || t2 > metaS[4])))
        return { title:"আয়াতের নম্বর ঠিক নয়", note:"সূরা " + metaS[2] + "-এ মোট " + bn(metaS[4]) + " আয়াত আছে — তার মধ্যে একটি নম্বর বলুন।", html:"" };
      if (t2 && t2 < f){ const x = f; f = t2; t2 = x; }
      return qaBuildSurahRead(nS, f, t2 || f, mode);
    }
    /* পুরো সূরা */
    return qaBuildSurahRead(nS, 1, 0, mode);
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
      const modeWords = /আরবি|তিলাওয়াত|উচ্চারণ|উচারণ|অনুবাদ|অর্থ|ভাবার্থ/.test(qn);
      const parts = qaModeFrom(qn, ["ar","uc","bn"]);
      return {
        title:"মিলে যাওয়া দোয়া — " + d.title,
        html: qaDuaCard(d, modeWords ? parts : ["ar","uc","bn"]) + (others ? `<div class="qa-card"><p class="qa-dim">আরও মিলেছে:</p><ul class="qa-mini">${others}</ul></div>` : ""),
        segments:[
          { t:"দোয়া — " + d.title + "।", lang:"bn" },
          ...(modeWords && parts.includes("ar") && qaHasVoice("ar") ? [{ t:d.ar, lang:"ar" }] :
             (modeWords && parts.includes("ar") ? [{ t:"উচ্চারণ — " + d.uc, lang:"bn" }] : [])),
          ...(modeWords && parts.includes("uc") ? [{ t:"উচ্চারণ — " + d.uc, lang:"bn" }] : []),
          ...((modeWords ? parts.includes("bn") : true) ? [{ t:"বাংলা অর্থ — " + d.bn, lang:"bn" }] : []),
          ...(d.src ? [{ t:"উৎস: " + d.src, lang:"bn" }] : [])
        ]
      };
    }
    return qaGeminiOrNote(qn, "দোয়া পাওয়া যায়নি", "অন্য কথায় লিখে দেখুন — যেমন: মা-বাবার জন্য দোয়া, অসুস্থতার দোয়া, সফরের দোয়া।");
  }

  /* ৮. হাদিস-সার্চ */
  if (/হাদিস|hadith/.test(qn)){
    const hits = qaSearchPool(qn, "hadith");
    if (hits.length){
      const h = hits[0].it;
      const others = hits.slice(1,3).map(x => `<li><b>${x.it.topic}</b></li>`).join("");
      const modeWords = /আরবি|তিলাওয়াত|উচ্চারণ|উচারণ|অনুবাদ|অর্থ|ভাবার্থ/.test(qn);
      const parts = qaModeFrom(qn, ["ar","uc","bn"]);
      return {
        title:"মিলে যাওয়া হাদিস — " + h.topic,
        html: qaHadithCard(h, modeWords ? parts : ["ar","uc","bn"]) + (others ? `<div class="qa-card"><p class="qa-dim">আরও মিলেছে:</p><ul class="qa-mini">${others}</ul></div>` : ""),
        segments:[
          { t:"হাদিসের বিষয় — " + h.topic + "।", lang:"bn" },
          ...(modeWords && parts.includes("ar") && qaHasVoice("ar") ? [{ t:h.ar, lang:"ar" }] :
             (modeWords && parts.includes("ar") && h.uc ? [{ t:"উচ্চারণ — " + h.uc, lang:"bn" }] : [])),
          ...(modeWords && parts.includes("uc") && h.uc ? [{ t:"উচ্চারণ — " + h.uc, lang:"bn" }] : []),
          { t:"অর্থ — " + h.bn, lang:"bn" },
          ...(h.src ? [{ t:"উৎস: " + h.src, lang:"bn" }] : []),
          ...(h.disc && h.disc[0] && (!modeWords || parts.includes("bn")) ? [{ t:"ব্যাখ্যা — " + h.disc[0], lang:"bn" }] : [])
        ]
      };
    }
    return qaGeminiOrNote(qn, "হাদিস পাওয়া যায়নি", "অন্য কথায় লিখে দেখুন — যেমন: নিয়ত নিয়ে হাদিস, দানের ফজিলত হাদিস।");
  }

  /* ৯. জেমিনি AI + সার্বিক সার্চ (দোয়া + হাদিস + বাণী + আমল) */
  const hits = qaSearchPool(qn, "any");
  const gAns = await qaGemini(qn, qaCtxSummary(hits));
  if (hits.length){
    const h0 = hits[0];
    const listHtml = hits.slice(0,3).map(h => {
      if (h.type === "dua") return `<li><b>দোয়া:</b> ${h.it.title} — ${h.it.src || ""}</li>`;
      if (h.type === "hadith") return `<li><b>হাদিস:</b> ${h.it.topic}</li>`;
      if (h.type === "bani") return `<li><b>বাণী:</b> “${h.it.q}” (${h.it.r})</li>`;
      return `<li><b>আমল:</b> ${h.it.t}</li>`;
    }).join("");
    if (gAns){
      return {
        title:"জেমিনি AI-এর উত্তর",
        html: qaGeminiCard(gAns)
            + `<div class="qa-card"><p class="qa-dim">মিলিয়ে দেখুন — অ্যাপের ভেতর থেকে পাওয়া সংশ্লিষ্ট অংশ:</p><ul class="qa-mini">${listHtml}</ul></div>`,
        segments: qaTextToBnSegs(gAns)
      };
    }
    const aiWarn = (typeof qaAIState !== "undefined" && qaAIState.lastWhy) ?
      `<p class="qa-vwarn">ℹ️ AI সহায়ক এবার পৌঁছানো যায়নি (${qaAIState.lastWhy}) — তাই অ্যাপের ভাণ্ডার থেকে উত্তর দেখানো হলো।</p>` : "";
    let seg = "আপনার প্রশ্নের সাথে সবচেয়ে বেশি মিলেছে — ";
    if (h0.type === "dua") seg += "দোয়া: " + h0.it.title + " — " + h0.it.bn;
    else if (h0.type === "hadith") seg += "হাদিস: " + h0.it.topic + " — " + h0.it.bn;
    else if (h0.type === "bani") seg += "বাণী: " + h0.it.q;
    else seg += h0.it.t + " — " + (h0.it.d || "");
    return {
      title:"আপনার প্রশ্নের উত্তর",
      html: aiWarn + (h0.type === "dua" ? qaDuaCard(h0.it) : h0.type === "hadith" ? qaHadithCard(h0.it)
           : `<div class="qa-card"><p class="qa-quote">“${h0.it.q || h0.it.t}”</p><p class="qa-dim">${h0.it.r || h0.it.d || ""}</p></div>`)
          + `<div class="qa-card"><p class="qa-dim">সম্পর্কিত আরও ফলাফল:</p><ul class="qa-mini">${listHtml}</ul></div>`,
      segments:[{ t:seg, lang:"bn" }]
    };
  }

  if (gAns){
    return {
      title:"জেমিনি AI-এর উত্তর",
      html: qaGeminiCard(gAns),
      segments: qaTextToBnSegs(gAns)
    };
  }

  return {
    title:"প্রশ্নটি এবার ঠিকমতো নেওয়া গেল না",
    note:"কারণ: " + (qaAIState.lastWhy || "অ্যাপের ভাণ্ডারে সরাসরি মিল পাইনি") + "। একটু পরে আবার করুন বা ভাষা বদলিয়ে লিখুন — যেমন: “সূরা ফাতিহার অনুবাদ শোনাও”, “কুরআনে কতটি সূরা আছে”, “রোজা ভাঙার বিষয়গুলো কী”।",
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

function qaDuaCard(d, parts){
  parts = parts || ["ar","uc","bn"];
  return `
  <div class="qa-card">
    <h4 class="qa-card-h">${d.title}</h4>
    ${parts.includes("ar") ? `<p class="ar qa-ar" lang="ar">${d.ar}</p>` : ""}
    ${parts.includes("uc") ? `<p class="uc"><i>উচ্চারণ</i>${d.uc}</p>` : ""}
    ${parts.includes("bn") ? `<p class="bn"><i>অর্থ</i>${d.bn}</p>` : ""}
    ${d.src ? `<p class="qa-dim">${d.src}</p>` : ""}
  </div>`;
}
function qaHadithCard(h, parts){
  parts = parts || ["ar","uc","bn"];
  return `
  <div class="qa-card">
    <h4 class="qa-card-h">${h.topic}</h4>
    ${parts.includes("ar") ? `<p class="ar qa-ar" lang="ar">${h.ar}</p>` : ""}
    ${parts.includes("uc") && h.uc ? `<p class="uc"><i>উচ্চারণ</i>${h.uc}</p>` : ""}
    ${parts.includes("bn") ? `<p class="bn"><i>অর্থ</i>${h.bn}</p>` : ""}
    <p class="qa-dim">${h.narrator || ""} — ${h.src || ""}</p>
    ${parts.includes("bn") && h.disc && h.disc.length ? `<p class="qa-disc">${h.disc[0]}</p>` : ""}
  </div>`;
}

/* -------------------- জেমিনি AI সংযোগ --------------------
   উৎস-ক্রম: ১) ডিভাইসে সংরক্ষিত ব্যক্তিগত কী → সরাসরি Gemini API
             ২) js/config.js-এ এমবেড করা কী → সরাসরি Gemini API
             ৩) সাইটের সার্ভার-প্রক্সি (/api/ask) — কী Vercel-এ গোপন থাকে
   কিছুই না পেলে চুপচাপ খালি স্ট্রিং — তখন লোকাল ইঞ্জিনই উত্তর দেয়। */
function qaGeminiKey(){
  try {
    const ls = localStorage.getItem("qh.geminiKey");
    if (ls && ls.length > 15) return ls;
  } catch(e){}
  try {
    if (typeof window !== "undefined" && window.QA_GEMINI_KEY && window.QA_GEMINI_KEY.length > 15) return window.QA_GEMINI_KEY;
  } catch(e){}
  return "";
}
function qaGeminiProxyUrl(){
  try {
    if (/^file:$/.test(location.protocol)) return "https://quranohadis.vercel.app/api/ask"; /* APK WebView */
  } catch(e){}
  return "/api/ask";
}
function qaGeminiPrompt(q, ctx){
  return "তুমি \"কুরআন ও হাদিস\" নামের একটি বাংলা ইসলামিক অ্যাপের AI সহকারী।\n\n" +
"কড়া নিয়মাবলি:\n" +
"১) উত্তর সবসময় সহজ, খাঁটি বাংলায়; ৩–৮ লাইনের মধ্যে সংক্ষিপ্ত রাখবে।\n" +
"২) কুরআনের তথ্য দিলে সূরা ও আয়াত নম্বর উল্লেখ করবে; হাদিসের ক্ষেত্রে গ্রন্থের নাম বলবে।\n" +
"৩) নিচের \"অ্যাপের ডেটা\" অংশে তথ্য থাকলে সেটাই মূল উৎস — তার সাথে সাংঘর্ষিক কিছু বলবে না।\n" +
"৪) নিশ্চিত না হলে স্পষ্ট করে জানিয়ে দেবে; ক্ষমা চাওয়া, অভিবাদন, ভূমিকা — এসব একদম বাদ।\n" +
"৫) ফিকহি দ্বিমত থাকলে এক-দুই লাইনে উল্লেখ করবে, তর্কে যাবে না।\n\n" +
"অ্যাপের ডেটা থেকে পাওয়া সংশ্লিষ্ট তথ্য:\n" + (ctx || "(সুনির্দিষ্ট মিল পাওয়া যায়নি)") + "\n\n" +
"ব্যবহারকারীর প্রশ্ন: " + q + "\n\nএবার শুধু উত্তরটি লেখো:";
}
async function qaGeminiViaServer(q, ctx){
  const opt = (typeof AbortSignal !== "undefined" && AbortSignal.timeout) ? { signal: AbortSignal.timeout(25000) } : {};
  const r = await fetch(qaGeminiProxyUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-qa-client": "quranohadis" },
    body: JSON.stringify({ q: q.slice(0, 600), ctx: String(ctx || "").slice(0, 3500) }),
    ...opt
  });
  if (!r.ok){
    if (r.status === 501){ try { localStorage.setItem("qh.aiOk", "0"); } catch(e){} }
    throw new Error("proxy-" + r.status);
  }
  const j = await r.json();
  if (j && j.answer){ try { localStorage.setItem("qh.aiOk", "1"); } catch(e){} }
  if (j && j.answer) return String(j.answer).trim();
  throw new Error("proxy-empty");
}
const QA_G_MODELS = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-3-flash-preview"];
async function qaGeminiDirect(q, ctx, key){
  const prompt = qaGeminiPrompt(q, ctx);
  const opt = (typeof AbortSignal !== "undefined" && AbortSignal.timeout) ? { signal: AbortSignal.timeout(25000) } : {};
  for (const m of QA_G_MODELS){
    try {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + m + ":generateContent?key=" + encodeURIComponent(key), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.25, maxOutputTokens: 1400 }
        }),
        ...opt
      });
      if (!r.ok) continue;
      const j = await r.json();
      const cand = (j && j.candidates && j.candidates[0]) || {};
      const parts = (cand.content && cand.content.parts) || [];
      const txt = parts.map(p => p.text || "").join("").trim();
      if (txt) return txt;
    } catch(e){}
  }
  throw new Error("gemini-direct-fail");
}
const qaAIState = { lastWhy: "" };
async function qaGemini(q, ctx){
  qaAIState.lastWhy = "";
  try {
    const key = qaGeminiKey();
    if (key){
      try { return await qaGeminiDirect(q, ctx, key); }
      catch(e){ qaAIState.lastWhy = "কী-সরাসরি সংযোগ ব্যর্থ"; }
    }
    return await qaGeminiViaServer(q, ctx);
  } catch(e){
    if (!qaAIState.lastWhy) qaAIState.lastWhy = "সংযোগ/কোটা — এই মুহূর্তে AI পাওয়া যায়নি";
    return "";
  }
}
function qaCtxSummary(hits){
  if (!hits || !hits.length) return "";
  return hits.slice(0, 3).map(h => {
    if (h.type === "dua") return "দোয়া — " + h.it.title + ": " + String(h.it.bn || "").slice(0, 320);
    if (h.type === "hadith") return "হাদিস — " + h.it.topic + ": " + String(h.it.bn || "").slice(0, 320) + (h.it.src ? " (" + h.it.src + ")" : "");
    if (h.type === "bani") return "বাণী — “" + h.it.q + "” (" + h.it.r + ")";
    return "আমল — " + h.it.t + ": " + String(h.it.d || "").slice(0, 220);
  }).join("\n");
}
function qaTextToBnSegs(txt){
  const clean = String(txt || "").replace(/\s*\n+\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  if (!clean) return [];
  const parts = clean.match(/[^।!?\n]+[।!?]?/g) || [clean];
  const segs = [];
  let buf = "";
  parts.forEach(p => {
    if ((buf + " " + p).trim().length > 240){ if (buf) segs.push({ t: buf.trim(), lang: "bn" }); buf = p; }
    else buf = (buf ? buf + " " : "") + p;
  });
  if (buf.trim()) segs.push({ t: buf.trim(), lang: "bn" });
  return segs;
}
function qaEsc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function qaGeminiCard(txt){
  const paras = String(txt).split(/\n{1,}/).map(p => p.trim()).filter(Boolean);
  const inner = paras.length ? paras.map(p => `<p>${qaEsc(p)}</p>`).join("") : `<p>${qaEsc(txt)}</p>`;
  return `
  <div class="qa-card qa-ai">
    <h4 class="qa-card-h">✦ জেমিনি AI বলছে</h4>
    <div class="qa-ai-txt">${inner}</div>
    <p class="qa-dim">AI-এর উত্তর ভুল হতে পারে — কুরআন-হাদিসের ব্যাপারে অ্যাপের ভেতরের মূল পাঠের সাথে মিলিয়ে নিন।</p>
  </div>`;
}
async function qaGeminiOrNote(qn, title, note){
  const gAns = await qaGemini(qn, "");
  if (gAns) return { title: "জেমিনি AI-এর উত্তর", html: qaGeminiCard(gAns), segments: qaTextToBnSegs(gAns) };
  return { title, note, html: "" };
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
    "আজকের বাণী শোনাও",
    "কুরআনে কতটি সূরা আছে",
    "কুরআনে কোন কোন নবীর নাম আছে"
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

    <section class="qa-settings pattern">
      <button class="qa-set-toggle" id="qaSetToggle" aria-expanded="false">⚙︎ AI সেটিংস (জেমিনি) <span class="qa-ai-dot" id="qaAiDot"></span></button>
      <div class="qa-set-body" id="qaSetBody" hidden>
        <p class="qa-dim">সাইটের সার্ভারে AI সংযুক্ত থাকলে কিছু করতে হবে না — সবার জন্য চলবে। নিজের জেমিনি API-কী ব্যবহার করতে চাইলে নিচে বসিয়ে “সংরক্ষণ” চাপুন — কী শুধু এই ডিভাইসে থাকবে।</p>
        <div class="qa-set-row">
          <input id="qaKeyInput" class="ask-input" style="min-height:0;padding:9px 11px;font-size:13.5px" type="password" placeholder="Gemini API key (AIza...)" autocomplete="off">
          <button class="qa-btn gold" id="qaKeySave">সংরক্ষণ</button>
          <button class="qa-btn" id="qaKeyClear">মুছুন</button>
        </div>
        <div class="qa-set-row" style="margin-top:10px">
          <label class="qa-dim" style="margin:0">কণ্ঠ-ইঞ্জিন:</label>
          <select id="qaTtsSel" class="ask-lang">
            <option value="auto">সয়ংক্রিয় (সুপারিশকৃত)</option>
            <option value="online">অনলাইন ইঞ্জিন (ইন্টারনেট লাগে — প্রায় সব ফোনে বাজে)</option>
            <option value="device">ডিভাইসের নিজের কণ্ঠ (অফলাইনে চলে)</option>
          </select>
        </div>
        <p class="qa-ai-status" id="qaAiStatus">…</p>
        <p class="qa-dim" style="margin-top:4px">ফ্রি কী বানাতে: <span class="qa-mono">aistudio.google.com</span> → “Get API key” → “Create API key”।</p>
      </div>
    </section>

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
  const langWrap = $("#askLangWrap");
  const nosr = $("#askNoSR");
  /* অ্যাপ (ওয়েবভিউ)-এর ভেতরে: নেটিভ স্পিচ-রিকগনাইজার ব্রিজ */
  let nativeOk = false;
  if (typeof window.AndroidQASR !== "undefined"){
    try { nativeOk = !!window.AndroidQASR.srAvailable(); } catch(e){ nativeOk = false; }
  }
  if (nativeOk){
    mic.addEventListener("click", ()=>{
      if (qaListening){ try{ window.AndroidQASR.stopSR(); }catch(e){} return; }
      qaStartNativeListening();
    });
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR){
    mic.hidden = true;
    if (langWrap) langWrap.hidden = true;
    if (nosr){ nosr.hidden = false; nosr.innerHTML = "এই ব্রাউজারে ভয়েস-ইনপুট চালু নেই — মোবাইল হলে কিবোর্ডের (Gboard-এর) মাইক আইকন চেপ৓েও বলে লিখতে পারেন, অথবা টাইপ করুন।"; }
    return;
  }
  mic.addEventListener("click", ()=>{
    if (qaListening){ try{ qaRec.stop(); }catch(e){} return; }
    qaStartListening();
  });
}

/* --- অ্যাপের নেটিভ মাইক (Java ব্রিজ: window.AndroidQASR) --- */
function qaStartNativeListening(){
  const mic = $("#askMic"), stat = $("#askMicStat"), wave = $("#askWave");
  const inp = $("#askInput");
  const langSel = $("#askLang");
  const lang = langSel ? langSel.value : "bn-BD";
  qaListening = true;
  qaVoiceInputUsed = true;
  let finalTxt = "";
  if (mic) mic.classList.add("live");
  if (stat){ stat.hidden = false; stat.textContent = "🎙 শুনছি — বলুন…"; }
  if (wave) wave.hidden = false;
  window.qaNativeSR = {
    partial(t2){ if (inp) inp.value = (finalTxt ? finalTxt + " " : "") + t2; },
    final(t2){
      finalTxt = (finalTxt ? finalTxt + " " : "") + t2;
      if (inp) inp.value = finalTxt;
      qaNativeCleanup(); qaSubmit();
    },
    error(msg){
      qaNativeCleanup();
      if (stat){ stat.hidden = false; stat.textContent = "🎙 " + msg + " — আবার চেষ্টা করুন।"; setTimeout(()=>{ if (stat) stat.hidden = true; }, 3200); }
    },
    end(){ qaNativeCleanup(); if (finalTxt.trim()) qaSubmit(); }
  };
  function qaNativeCleanup(){
    qaListening = false;
    if (mic) mic.classList.remove("live");
    if (wave) wave.hidden = true;
    if (stat) stat.hidden = true;
  }
  try { window.AndroidQASR.startSR(lang); }
  catch(e){
    qaNativeCleanup();
    if (stat){ stat.hidden = false; stat.textContent = "নেটিভ ভয়েস-ইনপুট চালু হয়নি — টাইপ করুন।"; }
  }
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

  /* AI সেটিংস */
  const tg = $("#qaSetToggle");
  if (tg) tg.addEventListener("click", ()=>{
    const b = $("#qaSetBody");
    if (b){ b.hidden = !b.hidden; tg.setAttribute("aria-expanded", String(!b.hidden)); }
  });
  qaAiStatusRefresh();
  const ks = $("#qaKeySave");
  if (ks) ks.addEventListener("click", ()=>{
    const k = ($("#qaKeyInput") && $("#qaKeyInput").value || "").trim();
    if (k.length < 15){
      qaAiStatusSet("কীটা ছোট মনে হচ্ছে — পুরো কী বসান।", false);
      return;
    }
    try { localStorage.setItem("qh.geminiKey", k); } catch(e){}
    qaAiStatusSet("নিজের কী সংরক্ষণ হয়েছে ✓ — এবার উত্তর জেমিনি AI থেকে আসবে।", true);
  });
  const tsel = $("#qaTtsSel");
  if (tsel){
    try { tsel.value = qaTtsPref(); } catch(e){}
    tsel.addEventListener("change", ()=>{
      try { localStorage.setItem("qh.ttsEngine", tsel.value); } catch(e){}
      qaStopSpeech();
    });
  }
  const kc = $("#qaKeyClear");
  if (kc) kc.addEventListener("click", ()=>{
    try { localStorage.removeItem("qh.geminiKey"); } catch(e){}
    const kI = $("#qaKeyInput"); if (kI) kI.value = "";
    qaAiStatusRefresh();
  });

  qaInitVoice();
}

function qaAiStatusSet(msg, ok){
  const st = $("#qaAiStatus"); if (st) st.innerHTML = msg;
  const dot = $("#qaAiDot");
  if (dot) dot.className = "qa-ai-dot " + (ok ? "on" : "off");
}
function qaAiStatusRefresh(){
  if (qaGeminiKey()){ qaAiStatusSet("✓ এই ডিভাইসে নিজের জেমিনি-কী সংযুক্ত আছে।", true); return; }
  try {
    const flag = localStorage.getItem("qh.aiOk");
    if (flag === "1"){ qaAiStatusSet("✓ সার্ভারের মাধ্যমে জেমিনি AI সংযুক্ত আছে।", true); return; }
  } catch(e){}
  qaAiStatusSet("সার্ভার-কী পরীক্ষা করা হয়নি — সাধারণ প্রশ্ন করলেই AI যুক্ত কিনা বোঝা যাবে; নইলে লোকাল ইঞ্জিনই উত্তর দেবে।", false);
}

/* -------------------- বুট-নিশ্চিতকরণ --------------------
   app.js নিজের শেষেই প্রথম render() চালায় — সেসময় qa.js এখনো লোড হয়নি
   (index.html-এ qa.js আসে app.js-এর পরে)। তাই লোড শেষে অবস্থান অনুযায়ী
   আবার একবার পেজ আঁকাই — আইডেম্পোটেন্ট, নিরাপদ। */
try {
  if (typeof render === "function"){ render(); }
} catch(e){ if (typeof console !== "undefined") console.warn("qa boot render:", e); }
