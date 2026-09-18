/* =====================================================================
   হিদায়াত — App engine
   ===================================================================== */

"use strict";

/* -------------------------- helpers -------------------------- */
const $ = s => document.querySelector(s);
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const bn = n => String(n).replace(/\d/g, d => BN_DIGITS[+d]);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const WEEKDAYS = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
const EN_MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const BN_MONTHS = ["বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ","ভাদ্র","আশ্বিন","কার্তিক","অগ্রহায়ণ","পৌষ","মাঘ","ফাল্গুন","চৈত্র"];
const HIJRI_MONTHS = ["মুহাররম","সফর","রবিউল আউয়াল","রবিউস সানি","জমাদিউল আউয়াল","জমাদিউস সানি","রজব","শাবান","রমজান","শাওয়াল","জিলকদ","জিলহজ"];

/* -------------------------- dates -------------------------- */
function gregorianBn(d){
  return `${bn(d.getDate())} ${EN_MONTHS[d.getMonth()]} ${bn(d.getFullYear())} খ্রি.`;
}

/* বাংলা সংবত — বাংলাদেশের সংশোধিত পঞ্জিকা (১ আল বৈশাখ = ১৪ এপ্রিল) */
function banglaDate(d){
  const y = d.getFullYear();
  const start = new Date(y, 3, 14); // ১৪ এপ্রিল
  let by, sd;
  if (d >= start){ by = y - 593; sd = start; }
  else           { by = y - 594; sd = new Date(y-1, 3, 14); }
  const leap = yy => (yy%4===0 && yy%100!==0) || yy%400===0;
  const falgunLen = leap(by + 594) ? 30 : 29; // ফাল্গুন অধিবর্ষে ৩০ দিন
  const lens = [31,31,31,31,31,30,30,30,30,30,falgunLen,30];
  let diff = Math.floor((d - sd) / 86400000);
  let m = 0;
  while (diff >= lens[m]){ diff -= lens[m]; m++; }
  return `${bn(diff+1)} ${BN_MONTHS[m]} ${bn(by)} বঙ্গাব্দ`;
}

/* হিজরি (উম্মুল কুরা গণনা — চাঁদ দেখা সাপেক্ষে ±১ দিন হতে পারে) */
function hijriDate(d){
  try{
    const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura",
      { day:"numeric", month:"numeric", year:"numeric" });
    const p = fmt.formatToParts(d);
    const get = t => (p.find(x => x.type === t) || {}).value;
    const m = parseInt(get("month"), 10);
    if (!m || get("day") == null) return null;
    return `${bn(get("day"))} ${HIJRI_MONTHS[m-1]} ${bn(parseInt(get("year"),10))} হিজরি`;
  }catch(e){ return null; }
}

function dayPeriod(h){
  if (h >= 5 && h < 6)  return "ভোর";
  if (h >= 6 && h < 12) return "সকাল";
  if (h >= 12 && h < 16) return "দুপুর";
  if (h >= 16 && h < 18) return "বিকেল";
  if (h >= 18 && h < 20) return "সন্ধ্যা";
  return "রাত";
}

/* -------------------------- icons -------------------------- */
const I = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-5.5h4V21"/></svg>',
  dua:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11.5V6.8a1.8 1.8 0 0 1 3.6 0v3.9"/><path d="M10.6 10.7V5.2a1.8 1.8 0 0 1 3.6 0v5.2"/><path d="M14.2 10.7V7a1.8 1.8 0 0 1 3.6 0v6.6c0 4-2.6 7.4-6.4 7.4-2.5 0-4-1-5.4-3.1l-1.9-3c-.7-1.1-.1-2.4 1.1-2.6.8-.1 1.5.2 1.9.8l.9 1.4"/></svg>',
  hadith:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10.6 4.8 8.4 4 5.5 4c-.9 0-1.8.1-2.5.3v14c.7-.2 1.6-.3 2.5-.3 2.9 0 5.1.8 6.5 2.5 1.4-1.7 3.6-2.5 6.5-2.5.9 0 1.8.1 2.5.3v-14c-.7-.2-1.6-.3-2.5-.3-2.9 0-5.1.8-6.5 2.5Z"/><path d="M12 6.5v14"/></svg>',
  quran:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 19.5V5.2A2.2 2.2 0 0 1 6.7 3h12.8v14.4H6.7a2.2 2.2 0 0 0-2.2 2.1Z"/><path d="M4.5 19.5A2.2 2.2 0 0 0 6.7 21.7h12.8v-4.3"/><path d="m14.8 6.4.8 1.7 1.8.2-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.2Z"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>',
  flower:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="2.6"/><path d="M12 4.6c1.6 0 2.6 1.4 2.6 2.9M12 4.6c-1.6 0-2.6 1.4-2.6 2.9M12 19.4c1.6 0 2.6-1.4 2.6-2.9M12 19.4c-1.6 0-2.6-1.4-2.6-2.9M4.6 12c0-1.6 1.4-2.6 2.9-2.6M19.4 12c0 1.6-1.4 2.6-2.9 2.6M4.6 12c0 1.6 1.4 2.6 2.9 2.6M19.4 12c0-1.6-1.4-2.6-2.9-2.6"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z"/><path d="M17 3.5h3M18.5 2v3"/></svg>',
  chev:'<svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  copy2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
  bkm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.15L5.5 21V4.5a1 1 0 0 1 1-1Z"/></svg>',
  go:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  android:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16.6 10.9 18.2 8a.9.9 0 1 0-1.6-.8l-1.5 2.7a8.6 8.6 0 0 0-6.2 0L7.4 7.2A.9.9 0 1 0 5.8 8l1.6 2.9A8.2 8.2 0 0 0 3.5 18v1.5h17V18a8.2 8.2 0 0 0-3.9-7.1Z"/><path d="M9 14h.01M15 14h.01"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>',
  back:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5Z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="3.6" height="14" rx="1.2"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 6.5C10.6 4.8 8.4 4 5.5 4c-.9 0-1.8.1-2.5.3v14c.7-.2 1.6-.3 2.5-.3 2.9 0 5.1.8 6.5 2.5 1.4-1.7 3.6-2.5 6.5-2.5.9 0 1.8.1 2.5.3v-14c-.7-.2-1.6-.3-2.5-.3-2.9 0-5.1.8-6.5 2.5Z"/><path d="M12 6.5v14"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l1.5 4.5L8 10a12.5 12.5 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21 3-9.5 9.5M21 3l-6.8 18-2.7-8.5L3 9.8 21 3Z"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/></svg>',
  diamond:'<svg width="8" height="8" viewBox="0 0 10 10" class="orn"><rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)" fill="currentColor"/></svg>'
};

/* -------------------------- state -------------------------- */
let tab = "home";
let duaCat = "all", duaQuery = "";
let detailDua = null; /* দোয়া ডিটেইল ভিউ (DUAS-এর ইনডেক্স) — null হলে তালিকা */
let quranQuery = "";
let readerSurah = null;          // number or null
let audioEl = null, audioSurah = 0, audioPlaying = false;
const openDuas = new Set();
const openHadiths = new Set();
const surahCache = {};
let pendingJump = null; // { surah, ayah } — মার্ক থেকে লাফ দেওয়ার সময়

/* গ্লোবাল ক্যাটাগরি-নাম (pageMarks সহ সব জায়গা থেকে ব্যবহারযোগ্য) */
const catNameOf = id => (DUA_CATS.find(c=>c.id===id)||{}).label || "";

/* ---------------- চিহ্নিত পড়া (bookmarks) — localStorage ---------------- */
const marks = {
  _k: "marks:v1",
  read(){
    try{
      const m = JSON.parse(localStorage.getItem(this._k));
      if (m && Array.isArray(m.q) && Array.isArray(m.h) && Array.isArray(m.d)) return m;
    }catch(e){}
    return { q:[], h:[], d:[] };
  },
  write(m){ try{ localStorage.setItem(this._k, JSON.stringify(m)); }catch(e){} },
  has(kind, id){ return this.read()[kind].includes(id); },
  toggle(kind, id){
    const m = this.read();
    const i = m[kind].indexOf(id);
    if (i >= 0) m[kind].splice(i, 1); else m[kind].unshift(id);
    this.write(m);
    return i < 0; // true = নতুন চিহ্নিত
  }
};

const todayKey = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; })();

/* ---------------- আজকের তারিখ — ajkertarikh.com থেকে সিংক ---------------- */
const remoteDate = { data: null };

function parseAjker(raw){
  let d = {};
  /* পূর্ণ HTML হলে ID দিয়ে পার্স */
  try{
    const doc = new DOMParser().parseFromString(raw, "text/html");
    const g = id => { const el = doc.getElementById(id); return el ? el.textContent.trim() : ""; };
    d = { day:g("today-day-value"), bn:g("bengali-date-value"), en:g("english-date-value"), ar:g("hijri-date-value") };
  }catch(e){}
  /* মার্কডাউন/টেক্সট হলে রেগেক্স ফলব্যাক */
  if (!d.day){ const m = raw.match(/আজকে\s*\*{0,2}\s*(রবিবার|সোমবার|মঙ্গলবার|বুধবার|বৃহস্পতিবার|শুক্রবার|শনিবার)\s*\*{0,2}/); if (m) d.day = m[1]; }
  if (!d.bn){ const m = raw.match(/[0-9০-৯]+(?:রা|ই|য়)?\s*(?:বৈশাখ|জ্যৈষ্ঠ|জৈষ্ঠ্য|আষাঢ়|শ্রাবণ|ভাদ্র|আশ্বিন|কার্তিক|অগ্রহায়ণ|পৌষ|মাঘ|ফাল্গুন|চৈত্র)\s*,?\s*[0-9০-৯]+\s*বঙ্গাব্দ/); if (m) d.bn = m[0].replace(/\s*,\s*/g," "); }
  if (!d.en){ const m = raw.match(/[0-9০-৯]+(?:ই|য়|রা)?\s*(?:জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর),?\s*[0-9০-৯]+\s*খ্রিস্টাব্দ/); if (m) d.en = m[0]; }
  if (!d.ar){ const m = raw.match(/[0-9০-৯]+(?:ই|য়|রা)?\s*(?:মহররম|মুহাররম|সফর|রবিউল আউয়াল|রবিউস সানি|জমাদিউল আউয়াল|জমাদিউস সানি|জুমাদাল উলা|জুমাদাল উখরা|রজব|শাবান|শা’বান|রমজান|শাওয়াল|জিলকদ|জিলহজ)[^,\n]{0,12},\s*[0-9০-৯]+\s*হিজরি/); if (m) d.ar = m[0]; }
  return d;
}

let ajkerRetried = false;
function syncAjkerTarikh(){
  /* আজকের জন্য একবার নেওয়া হয়ে থাকলে ক্যাশ ব্যবহার */
  try{
    const c = JSON.parse(localStorage.getItem("ajker:" + todayKey));
    if (c && c.bn && c.en && c.ar){
      remoteDate.data = c;
      applyRemoteDates();
      return;
    }
  }catch(e){}

  const target = encodeURIComponent("https://ajkertarikh.com/");
  const grab = u => fetch(u, { cache:"no-store" })
    .then(r => { if(!r.ok) throw 0; return r.text(); })
    .then(t => { if(!t || t.length < 2000) throw 0; return t; });

  const attempts = [
    grab("https://r.jina.ai/https://ajkertarikh.com/"),
    grab("https://api.allorigins.win/raw?url=" + target),
    grab("https://api.codetabs.com/v1/proxy/?quest=" + target)
  ];
  const firstOk = Promise.any
    ? Promise.any(attempts)
    : attempts.reduce((p,np) => p.catch(()=>np));

  firstOk
    .then(raw => {
      const d = parseAjker(raw);
      if (!d.bn || !d.en || !d.ar) return;
      remoteDate.data = d;
      try{
        Object.keys(localStorage).filter(k=>k.startsWith("ajker:")).forEach(k=>localStorage.removeItem(k));
        localStorage.setItem("ajker:" + todayKey, JSON.stringify(d));
      }catch(e){}
      applyRemoteDates();
    })
    .catch(()=>{
      /* ব্যর্থ হলে ১ মিনিট পর একবার আবার চেষ্টা; তারপর লোকাল ক্যালেন্ডারই থাকবে */
      if (!ajkerRetried){
        ajkerRetried = true;
        setTimeout(()=>{ if (!remoteDate.data) syncAjkerTarikh(); }, 60000);
      }
    });
}

/* হোম পেজ খোলা থাকলে জায়গায় জায়গায় আপডেট করে দেয় */
function applyRemoteDates(){
  const d = remoteDate.data;
  if (!d || tab !== "home") return;
  const set = (id, v) => { const el = document.getElementById(id); if (el && v) el.textContent = v; };
  set("dtEn", d.en);
  set("dtBn", d.bn);
  set("dtHij", d.ar);
  if (d.day) set("heroDayTxt", d.day);
  const note = document.getElementById("dateSrc");
  if (note) note.hidden = false;
}
const amolStore = {
  get(i){ return localStorage.getItem(`amol:${todayKey}:${i}`) === "1"; },
  set(i,v){ try{ localStorage.setItem(`amol:${todayKey}:${i}`, v ? "1" : "0"); }catch(e){} }
};

/* -------------------------- tab bar -------------------------- */
const TABS = [
  { id:"home",    label:"হোম",      icon:I.home },
  { id:"dua",     label:"দোয়া",     icon:I.dua },
  { id:"hadith",  label:"হাদিস",     icon:I.hadith },
  { id:"quran",   label:"কুরআন",     icon:I.quran },
  { id:"marks",   label:"চিহ্নিত",   icon:I.bkm },
  { id:"contact", label:"যোগাযোগ",  icon:I.chat }
];

function renderTabbar(){
  $("#tabbar").innerHTML = TABS.map(t => `
    <button class="tab ${tab===t.id?'on':''}" data-tab="${t.id}" aria-label="${t.label}">
      ${t.icon}<span>${t.label}</span><span class="dot"></span>
    </button>`).join("");
  document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => {
    if (tab === b.dataset.tab) return;
    tab = b.dataset.tab;
    detailDua = null;
    if (tab !== "quran"){ stopAudio(); }
    render();
    window.scrollTo({ top:0, behavior:"instant" });
  }));
}

/* -------------------------- pages -------------------------- */
function render(){
  renderTabbar();
  const v = $("#view");
  v.classList.add("pattern");
  if (tab === "home")        v.innerHTML = pageHome();
  else if (tab === "dua")    v.innerHTML = detailDua !== null ? pageDuaDetail() : pageDua();
  else if (tab === "hadith") v.innerHTML = pageHadith();
  else if (tab === "marks")   v.innerHTML = pageMarks();
  else if (tab === "contact") v.innerHTML = pageContact();
  else if (tab === "quran")  v.innerHTML = readerSurah ? pageReaderShell() : pageQuran();
  bind();
  if (tab === "quran" && readerSurah) loadSurahInto(readerSurah);
}

/* ============ HOME ============ */
function pageHome(){
  const now = new Date();
  const wd = now.getDay();
  const amol = AMOL[wd];
  const bani = DAILY_BANI[ Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000) % DAILY_BANI.length ];
  const doneCount = amol.items.filter((_,i)=>amolStore.get(i)).length;
  const pct = Math.round(doneCount / amol.items.length * 100);
  const dash = 2 * Math.PI * 26;

  const RD = remoteDate.data;
  const dateRows = [
    { icon:I.sun,    lbl:"ইংরেজি তারিখ",  val:(RD && RD.en) || gregorianBn(now), id:"dtEn" },
    { icon:I.flower, lbl:"বাংলা তারিখ",    val:(RD && RD.bn) || banglaDate(now),  id:"dtBn" },
    { icon:I.moon,   lbl:"আরবি (হিজরি) তারিখ", val:(RD && RD.ar) || hijriDate(now) || "—", id:"dtHij" }
  ];

  return `
  <div class="page pg-home">
    <section class="hero pattern">
      <div class="bismillah" lang="ar">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
      <div class="hero-daywrap"><span class="hero-day">${I.diamond} আজ <span id="heroDayTxt">${(RD && RD.day) || WEEKDAYS[wd]}</span> ${I.diamond}</span></div>
      <div class="clock"><span id="clockTime">--:--</span><span class="secs" id="clockSecs">--</span></div>
      <div class="clock-period">এখন <b id="clockPeriod">${dayPeriod(now.getHours())}</b> · বাংলাদেশ স্ট্যান্ডার্ড টাইম</div>
      <div class="date-rows">
        ${dateRows.map(r => `
          <div class="date-row">
            <span class="ic">${r.icon}</span>
            <div><div class="lbl">${r.lbl}</div><div class="val" id="${r.id}">${r.val}</div></div>
          </div>`).join("")}
      </div>
      <div class="hijri-note" id="dateSrc" ${RD ? "" : "hidden"}>☑ আজকের তারিখ <b>ajkertarikh.com</b> থেকে হালনাগাদকৃত</div>
      <div class="hijri-note">হিজরি তারিখ চাঁদ দেখা সাপেক্ষে একদিন আগে-পরে হতে পারে</div>
    </section>

    <section class="bani">
      <div class="tag">${I.diamond} আজকের বাণী</div>
      <p>“${bani.q}”</p>
      <div class="ref">— ${bani.r}</div>
    </section>

    <div class="sec-head">
      <h2>আজকের গুরুত্বপূর্ণ আমল <small>${amol.note}</small></h2>
      <span class="rule"></span>
    </div>

    <section class="amol-card">
      <div class="amol-top">
        <div class="ring">
          <svg width="58" height="58" viewBox="0 0 58 58">
            <defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#f0d698"/><stop offset="1" stop-color="#d6b25e"/>
            </linearGradient></defs>
            <circle class="bg" cx="29" cy="29" r="26" fill="none" stroke-width="4"/>
            <circle class="fg" cx="29" cy="29" r="26" fill="none" stroke-width="4"
              stroke-dasharray="${dash}" stroke-dashoffset="${dash * (1 - pct/100)}" id="ringFg"/>
          </svg>
          <span class="pct" id="ringPct">${bn(pct)}%</span>
        </div>
        <div class="t">
          <h3>${WEEKDAYS[wd]} বারের আমলতালিকা</h3>
          <p id="amolCount">${bn(doneCount)} / ${bn(amol.items.length)} সম্পন্ন — ট্যাপ করে চিহ্নিত করুন</p>
        </div>
      </div>
      <div class="amol-list">
        ${amol.items.map((a,i)=>`
          <div class="amol-item ${amolStore.get(i)?'done':''}" data-amol="${i}">
            <span class="tick">${I.check}</span>
            <div>
              <h4>${a.t}</h4>
              <p>${a.d}</p>
              <span class="ref">${a.r}</span>
            </div>
          </div>`).join("")}
      </div>
    </section>

    ${appDlCard()}
    ${footNote()}
  </div>`;
}

/* ============ DUA ============ */
function pageDua(){
  const q = duaQuery.trim();
  const list = DUAS.filter(d =>
    (duaCat === "all" || d.cat === duaCat) &&
    (!q || (d.title + d.uc + d.bn + d.ar).includes(q))
  );
  const catName = id => (DUA_CATS.find(c=>c.id===id)||{}).label || "";

  return `
  <div class="page pg-dua">
    <div class="sec-head" style="margin-top:14px">
      <h2>দোয়ার ভান্ডার <small>মাসনূন দোয়া — আরবি, উচ্চারণ ও অর্থসহ</small></h2>
      <span class="rule"></span>
    </div>

    <div class="searchbar">${I.search}
      <input id="duaSearch" type="text" placeholder="দোয়া খুঁজুন… (যেমন: ঘুম, ক্ষমা, কুরসি)" value="${esc(duaQuery)}">
    </div>

    <div class="chips" id="duaChips">
      ${DUA_CATS.map(c=>`<button class="chip ${duaCat===c.id?'on':''}" data-cat="${c.id}">${c.label}</button>`).join("")}
    </div>

    <div class="stagger" id="duaList">
      ${list.length ? list.map((d,i) => {
        const idx = DUAS.indexOf(d);
        return `
        <article class="dua-row" data-idx="${idx}" role="button" tabindex="0" aria-label="${esc(d.title)} — পুরো দোয়া পড়ুন">
          <div class="dua-num"><span class="med"></span><span>${bn(i+1)}</span></div>
          <div class="dr-tx">
            <h4>${d.title}</h4>
            <p class="dr-ar" lang="ar" dir="rtl">${d.ar}</p>
          </div>
          <span class="cat-tag">${catName(d.cat)}</span>
          <button class="mk ${marks.has("d",idx)?"on":""}" data-mk-kind="d" data-mk-id="${idx}" title="চিহ্নিত রাখুন">${I.bkm}</button>
          ${I.chev}
        </article>`;
      }).join("") : `<div class="errbox">দুঃখিত — “${esc(q)}” এর সাথে মিলে এমন কোনো দোয়া পাওয়া যায়নি।</div>`}
    </div>

    ${footNote()}
  </div>`;
}

/* ---------- দোয়া ডিটেইল ভিউ (ক্লিকে পুরো দোয়া) ---------- */
function pageDuaDetail(){
  const idx = detailDua;
  const d = DUAS[idx];
  if (!d){ detailDua = null; return pageDua(); }
  const catName = id => (DUA_CATS.find(c=>c.id===id)||{}).label || "";
  const marked = marks.has("d", idx);
  return `
  <div class="page pg-dua pg-duadetail">
    <div class="reader-top" style="margin-top:14px">
      <button class="backbtn" id="duaBack">${I.back} ফিরে যান</button>
      <span class="growfill"></span>
      <span class="cat-tag big">${catName(d.cat)}</span>
    </div>

    <article class="dua-detail">
      <div class="dd-meta">মাসনূন দোয়া — নং ${bn(idx+1)} / ${bn(DUAS.length)}</div>
      <h3 class="dd-title">${d.title}</h3>
      <p class="arabic dd-ar" lang="ar" dir="rtl">${d.ar}</p>
      <div class="uccharon"><span class="lbl">উচ্চারণ</span>${d.uc}</div>
      <p class="ortho dd-bn"><b>অর্থ:</b> ${d.bn}</p>
      <div class="dua-src">${I.book}<span>${d.src}</span></div>
      <div class="dd-actions">
        <button class="ddb ${marked?"on":""}" id="duaMk">${I.bkm}<span>${marked?"চিহ্নিত আছে ✓":"চিহ্নিত রাখুন"}</span></button>
        <button class="ddb" id="duaCopy">${I.copy2}<span>কপি করুন</span></button>
      </div>
    </article>

    <div class="dua-nav">
      <button class="dibtn" id="duaPrev" ${idx<=0?"disabled":""}>${I.back} আগের দোয়া</button>
      <button class="dibtn" id="duaNext" ${idx>=DUAS.length-1?"disabled":""}>পরের দোয়া ${I.go}</button>
    </div>
    ${footNote()}
  </div>`;
}

/* ============ HADITH ============ */
function pageHadith(){
  return `
  <div class="page pg-hadith">
    <div class="sec-head" style="margin-top:14px">
      <h2>নির্বাচিত হাদিস <small>বিশুদ্ধ হাদিস ও বাস্তব জীবনে প্রয়োগ</small></h2>
      <span class="rule"></span>
    </div>
    <div class="stagger">
      ${HADITHS.map((h,i)=>`
        <article class="hadith-card ${openHadiths.has(i)?'open':''}" data-h="${i}">
          <div class="topic-row">
            <span class="topic">${I.diamond} ${h.topic}</span>
            <button class="mk ${marks.has("h",i)?"on":""}" data-mk-kind="h" data-mk-id="${i}" title="চিহ্নিত রাখুন">${I.bkm}</button>
          </div>
          <p class="hadith-ar" lang="ar">${h.ar}</p>
          ${h.uc?`<div class="uccharon"><span class="lbl">উচ্চারণ</span>${h.uc}</div>`:""}
          <p class="hadith-bn">${h.bn}</p>
          <div class="hadith-meta">
            <span>বর্ণনাকারী: <b>${h.narrator}</b></span>
            <span><b>${h.src}</b></span>
          </div>
          <button class="hadith-open">${openHadiths.has(i)?'আলোচনা লুকান':'ব্যাখ্যা ও আলোচনা পড়ুন'} ${I.chev}</button>
          <div class="hadith-disc"><div><div class="inner">
            <h5>ব্যাখ্যা ও শিক্ষা</h5>
            ${h.disc.map(p=>`<p>${p}</p>`).join("")}
          </div></div></div>
        </article>`).join("")}
    </div>
    ${footNote()}
  </div>`;
}

/* ============ চিহ্নিত পড়া ============ */
function mkRow(kind, id, ic, title, sub){
  return `
  <div class="mark-row" data-jump="${kind}" data-id="${id}" role="button" tabindex="0">
    <span class="mk-ic">${ic}</span>
    <div class="mk-tx"><div class="mk-t">${title}</div><div class="mk-s">${sub}</div></div>
    <button class="mk-del" data-kind="${kind}" data-id="${id}" title="চিহ্ন সরিয়ে দিন" aria-label="সরান">✕</button>
    <span class="mk-go">${I.go}</span>
  </div>`;
}

function pageMarks(){
  const m = marks.read();
  const sec = (ic, title, rows) => rows ? `
    <div class="mk-sec">
      <div class="mk-sec-head">${ic}<span>${title}</span><b>${bn(rows.split('mark-row').length - 1)}</b></div>
      ${rows}
    </div>` : "";

  const qRows = m.q.map(id => {
    const [n,a] = id.split(":").map(Number);
    const s = SURAH_META.find(x => x[0] === n);
    return s ? mkRow("q", id, I.quran, `সূরা ${s[2]} — আয়াত ${bn(a)}`, `${bn(n)} নং সূরা · ${s[3]}`) : "";
  }).join("");
  const hRows = m.h.map(i => HADITHS[i]
    ? mkRow("h", String(i), I.hadith, `হাদিস: ${HADITHS[i].topic}`, HADITHS[i].src)
    : "").join("");
  const dRows = m.d.map(i => DUAS[i]
    ? mkRow("d", String(i), I.dua, DUAS[i].title, catNameOf(DUAS[i].cat))
    : "").join("");

  const hasAny = m.q.length || m.h.length || m.d.length;
  return `
  <div class="page pg-marks">
    <div class="sec-head" style="margin-top:14px">
      <h2>চিহ্নিত পড়া <small>আপনার সংরক্ষিত আয়াত, হাদিস ও দোয়া</small></h2>
      <span class="rule"></span>
    </div>
    ${hasAny ? `
    <div class="stagger">
      ${sec(I.quran, "কুরআনের আয়াত", qRows)}
      ${sec(I.hadith, "হাদিস", hRows)}
      ${sec(I.dua, "দোয়া", dRows)}
      <p class="mk-hint">${I.info}<span>যেকোনো আইটেমে চাপ দিলে সরাসরি সেই আয়াত / হাদিস / দোয়ায় পৌঁছে যাবেন। ✕ চাপলে চিহ্ন সরে যাবে।</span></p>
    </div>` : `
    <div class="mk-empty">
      ${I.bkm}
      <h4>এখনো কিছু চিহ্নিত করা হয়নি</h4>
      <p>কুরআনের যেকোনো আয়াতের পাশে, হাদিস কার্ডের উপরে অথবা দোয়ার শিরোনামে থাকা<br>
      <b style="color:var(--gold)">বুকমার্ক আইকনে</b> চাপ দিন — সেগুলো এখানে জমা থাকবে।</p>
    </div>`}
    ${footNote()}
  </div>`;
}

/* ---------------- মার্ক-জাম্প ---------------- */
function jumpToMark(kind, id){
  if (kind === "q"){
    const [n,a] = id.split(":").map(Number);
    pendingJump = { surah:n, ayah:a };
    tab = "quran"; readerSurah = n; stopAudio();
    render();
    window.scrollTo({ top:0, behavior:"instant" });
    return;
  }
  if (kind === "h"){
    const i = +id; openHadiths.add(i);
    tab = "hadith"; render();
    scrollFlash(`.hadith-card[data-h="${i}"]`);
    return;
  }
  const i = +id; detailDua = i; duaCat = "all"; duaQuery = "";
  tab = "dua"; render();
}
function scrollFlash(sel){
  setTimeout(()=>{
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({ behavior:"smooth", block:"center" });
    el.classList.add("flash");
    setTimeout(()=>el.classList.remove("flash"), 2500);
  }, 130);
}
function flashPending(){
  if (!pendingJump || pendingJump.surah !== readerSurah) return;
  const a = pendingJump.ayah; pendingJump = null;
  setTimeout(()=>{
    const el = document.getElementById("ayah-" + a);
    if (!el) return;
    el.scrollIntoView({ behavior:"smooth", block:"center" });
    el.classList.add("flash");
    setTimeout(()=>el.classList.remove("flash"), 2600);
  }, 160);
}

/* ============ যোগাযোগ ============ */
const ADMIN = {
  name:  "মোঃ উজ্জ্বল হোসেন",
  role:  "এডমিন — কুরআন ও হাদিস অ্যাপ",
  phone: "01713236980",
  tel:   "+8801713236980",
  email: "uzzalhossain.100@gmail.com"
};

function pageContact(){
  return `
  <div class="page pg-contact">
    <div class="sec-head" style="margin-top:14px">
      <h2>যোগাযোগ <small>আপনার মতামত আমাদের পথ দেখায়</small></h2>
      <span class="rule"></span>
    </div>

    <div class="stagger">
      <section class="contact-hero pattern">
        <div class="avatar"><span>উ</span></div>
        <h3>${ADMIN.name}</h3>
        <p class="role">${ADMIN.role}</p>
        <div class="plate-orn">${I.diamond}</div>
      </section>

      <a class="contact-row" href="tel:${ADMIN.tel}">
        <span class="ci">${I.phone}</span>
        <div><div class="lbl">মোবাইল</div><div class="val">${bn(ADMIN.phone)}</div></div>
        <span class="go">${I.phone}<span class="go-lbl">কল করুন</span></span>
      </a>

      <a class="contact-row" href="mailto:${ADMIN.email}">
        <span class="ci">${I.mail}</span>
        <div><div class="lbl">ইমেইল</div><div class="val" dir="ltr" style="text-align:left">${ADMIN.email}</div></div>
      </a>

      <section class="msg-card">
        <div class="msg-head">
          <h4>যে কোনো পরামর্শ ও অভিযোগের জন্য মেসেজ পাঠান</h4>
          <p>সেন্ড বাটনে ক্লিক করলে আপনার মেসেজ সরাসরি এডমিনের ইমেইলে পৌঁছে যাবে ইনশাআল্লাহ।</p>
        </div>
        <form id="contactForm" novalidate>
          <label class="field">
            <span>আপনার নাম</span>
            <div class="inp">${I.user}<input id="cName" type="text" maxlength="60" placeholder="নাম লিখুন…"></div>
          </label>
          <label class="field">
            <span>মোবাইল নাম্বার</span>
            <div class="inp">${I.phone}<input id="cPhone" type="tel" inputmode="tel" maxlength="16" placeholder="০১XXXXXXXXX" dir="ltr" style="text-align:right"></div>
          </label>
          <label class="field">
            <span>ইমেইল</span>
            <div class="inp">${I.mail}<input id="cEmail" type="email" maxlength="80" placeholder="name@example.com" dir="ltr" style="text-align:left"></div>
          </label>
          <label class="field">
            <span>মেসেজ</span>
            <div class="inp ta">${I.chat}<textarea id="cMsg" rows="5" maxlength="2000" required
              placeholder="এখানে আপনার পরামর্শ, অভিযোগ বা ভুল-ত্রুটির বিষয়টি লিখুন…"></textarea></div>
          </label>
          <div class="char-row"><span id="charCount">০ / ২০০০</span></div>
          <button type="submit" class="sendbtn" id="sendBtn">${I.send}<span>মেসেজ পাঠান</span></button>
          <div class="send-status" id="sendStatus" hidden></div>
        </form>
        <p class="msg-note">মেসেজটি <b dir="ltr">${ADMIN.email}</b> ঠিকানায় সরাসরি পৌঁছে যায় — কোনো মাধ্যমে সংরক্ষণ করা হয় না।</p>
      </section>
    </div>

    ${footNote()}
  </div>`;
}

/* ============ QURAN — index ============ */
function pageQuran(){
  const q = quranQuery.trim();
  const list = SURAH_META.filter(s =>
    !q || s[2].includes(q) || s[3].includes(q) || s[1].includes(q) || String(s[0]) === q || bn(s[0]) === q
  );
  return `
  <div class="page pg-quran">
    <div class="sec-head" style="margin-top:14px">
      <h2>আল-কুরআন <small>উচ্চারণ ও বাংলা অনুবাদসহ — ১১৪ সূরা</small></h2>
      <span class="rule"></span>
    </div>
    <div class="searchbar">${I.search}
      <input id="quranSearch" type="text" placeholder="সূরার নাম বা নম্বর লিখুন…" value="${esc(quranQuery)}">
    </div>
    <div class="stagger">
      ${list.length ? list.map(s=>`
        <div class="surah-row" data-surah="${s[0]}">
          <div class="num"><span class="med"></span><span>${bn(s[0])}</span></div>
          <div class="info">
            <h4>সূরা ${s[2]}<span class="surah-kind ${s[5]?'madani':''}">${s[5]?'মাদানী':'মাক্কী'}</span></h4>
            <p>${s[3]} · ${bn(s[4])} আয়াত</p>
          </div>
          <span class="ar-name" lang="ar">${s[1]}</span>
          <svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        </div>`).join("") : `<div class="errbox">“${esc(q)}” নামে কোনো সূরা পাওয়া যায়নি।</div>`}
    </div>
    ${footNote()}
  </div>`;
}

/* ============ QURAN — reader ============ */
function pageReaderShell(){
  const s = SURAH_META.find(x => x[0] === readerSurah);
  return `
  <div class="page pg-reader">
    <div class="reader-top" style="margin-top:14px">
      <button class="backbtn" id="readerBack">${I.back} তালিকা</button>
      <button class="audiobtn" id="audioBtn" title="তিলাওয়াত শুনুন (মিশারি আল-আফাসি)">${I.play}</button>
    </div>

    <div class="surah-plate pattern">
      <div class="ar" lang="ar">سُورَةُ ${s[1]}</div>
      <h3>সূরা ${s[2]}</h3>
      <div class="meta">${s[3]} · ${bn(s[4])} আয়াত · ${s[5]?'মাদানী':'মাক্কী'}</div>
      <div class="plate-orn">${I.diamond}</div>
    </div>

    ${s[0] !== 9 ? `<div class="reader-bismillah" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>` : ""}
    <div id="readerBody"></div>

    <div class="reader-nav">
      <button id="prevSurah" ${s[0]<=1?'disabled':''}>← পূর্ববর্তী সূরা</button>
      <button id="nextSurah" ${s[0]>=114?'disabled':''}>পরবর্তী সূরা →</button>
    </div>
    ${footNote()}
  </div>`;
}

function loadSurahInto(n){
  const body = $("#readerBody");
  if (!body) return;

  if (BUNDLED[n]){
    body.innerHTML = BUNDLED[n].map((a,i)=>`
      <article class="ayah" id="ayah-${i+1}">
        <div class="badge-row"><span class="ayah-badge">৲ ${bn(i+1)}</span>
          <button class="mk ${marks.has("q", n+":"+(i+1))?"on":""}" data-mk-kind="q" data-mk-id="${n}:${i+1}" title="চিহ্নিত রাখুন">${I.bkm}</button>
        </div>
        <p class="ar" lang="ar">${a[0]}</p>
        <p class="uc"><i>উচ্চারণ</i>${a[1]}</p>
        <p class="bn"><i>অনুবাদ</i>${a[2]}</p>
      </article>`).join("");
    bindReaderMarks();
    flashPending();
    return;
  }

  if (surahCache[n]){ renderFetched(n, surahCache[n]); return; }

  body.innerHTML = Array.from({length:3}).map(()=>`
    <div class="skel"><div class="ln"></div><div class="ln"></div><div class="ln"></div></div>`).join("");

  fetch(`https://api.alquran.cloud/v1/surah/${n}/editions/quran-uthmani,bn.bengali`)
    .then(r => { if(!r.ok) throw new Error("network"); return r.json(); })
    .then(j => {
      const [ar, bnEd] = j.data;
      /* সূরা ১ ও ৯ ছাড়া সবগুলোতে প্রথম আয়াতে বিসমিল্লাহ সংযুক্ত — শুরুর ৪ শব্দ বাদ */
      const stripBismillah = t => {
        const w = t.trim().split(/\s+/);
        const norm = s => s.replace(/[\u064B-\u0653\u0670]/g, "");
        return (w.length > 4 && norm(w[0]) === "بسم") ? w.slice(4).join(" ") : t;
      };
      surahCache[n] = ar.ayahs.map((a,i)=>{
        let t = a.text;
        if (i === 0 && n !== 1 && n !== 9) t = stripBismillah(t);
        return { ar:t, bn:bnEd.ayahs[i].text };
      });
      renderFetched(n, surahCache[n]);
    })
    .catch(()=>{
      if (!document.body.contains(body)) return;
      body.innerHTML = `
        <div class="errbox">
          ${I.info}<br>
          এই সূরাটি লোড করতে ইন্টারনেট সংযোগ প্রয়োজন।<br>
          সংযোগ দেওয়ার পর আবার চেষ্টা করুন।
          <br><button id="retrySurah">আবার চেষ্টা করুন</button>
        </div>`;
      const b = $("#retrySurah");
      if (b) b.addEventListener("click", ()=>loadSurahInto(n));
    });
}

function renderFetched(n, data){
  const body = $("#readerBody");
  if (!body || readerSurah !== n) return;
  body.innerHTML = `
    <div class="notice">${I.info}<span>এই সূরার <b>বাংলা উচ্চারণ স্বয়ংক্রিয়ভাবে</b> তৈরি — সামান্য ত্রুটি থাকতে পারে। শুদ্ধ মাখরাজ ও তাজবীদ অভিজ্ঞ ওস্তাদের নিকট শেখা উত্তম।</span></div>
    ${data.map((a,i)=>`
      <article class="ayah" id="ayah-${i+1}">
        <div class="badge-row"><span class="ayah-badge">৲ ${bn(i+1)}</span>
          <button class="mk ${marks.has("q", n+":"+(i+1))?"on":""}" data-mk-kind="q" data-mk-id="${n}:${i+1}" title="চিহ্নিত রাখুন">${I.bkm}</button>
        </div>
        <p class="ar" lang="ar">${a.ar}</p>
        <p class="uc"><i>উচ্চারণ</i>${Translit.toBn(a.ar)}</p>
        <p class="bn"><i>অনুবাদ</i>${a.bn}</p>
      </article>`).join("")}`;
  bindReaderMarks();
  flashPending();
}

/* ---------------- audio ---------------- */
function stopAudio(){
  if (audioEl){ audioEl.pause(); audioEl = null; }
  audioPlaying = false; audioSurah = 0;
  const b = $("#audioBtn"); if (b) b.classList.remove("playing");
}
function toggleAudio(n){
  const btn = $("#audioBtn");
  if (!btn) return;
  if (audioPlaying && audioSurah === n){
    audioEl.pause(); audioPlaying = false;
    btn.classList.remove("playing"); btn.innerHTML = I.play; return;
  }
  stopAudio();
  audioEl = new Audio(`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`);
  audioSurah = n;
  const p = audioEl.play();
  if (p && p.then){
    p.then(()=>{ audioPlaying = true; btn.classList.add("playing"); btn.innerHTML = I.pause; })
     .catch(()=>{ btn.innerHTML = I.play; });
  }
  audioEl.addEventListener("ended", ()=>{ audioPlaying=false; btn.classList.remove("playing"); btn.innerHTML = I.play; });
}

/* ---------------- bindings ---------------- */
/* রিডারের আয়াতগুলো bind() চলার পরে (async) লোড হয় — তাই আলাদা বাইন্ডিং */
function bindReaderMarks(){
  document.querySelectorAll("#readerBody .mk").forEach(b => {
    if (b.dataset.bound) return; b.dataset.bound = "1";
    b.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      const on = marks.toggle("q", b.dataset.mkId);
      b.classList.toggle("on", on);
      b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse");
    });
  });
}
function bind(){
  /* dua */
  const ds = $("#duaSearch");
  if (ds) ds.addEventListener("input", e => {
    duaQuery = e.target.value;
    const list = $("#duaList").parentElement;
    const pos = e.target.selectionStart;
    renderTabOnly("dua", ()=>{
      const el = $("#duaSearch");
      el.focus(); el.setSelectionRange(pos,pos);
    });
  });
  const chips = $("#duaChips");
  if (chips) chips.querySelectorAll(".chip").forEach(c =>
    c.addEventListener("click", ()=>{ duaCat = c.dataset.cat; detailDua = null; renderTabOnly("dua"); })
  );
  /* দোয়া তালিকার রো → ডিটেইল ভিউ */
  document.querySelectorAll("#duaList .dua-row").forEach(r =>
    r.addEventListener("click", e => {
      if (e.target.closest("[data-mk-kind]")) return; /* বুকমার্ক বাটন আলাদা */
      detailDua = +r.dataset.idx;
      renderTabOnly("dua");
      window.scrollTo({ top:0, behavior:"instant" });
    })
  );

  /* দোয়া ডিটেইল ভিউ নেভিগেশন */
  const db = $("#duaBack");
  if (db) db.addEventListener("click", ()=>{ detailDua = null; renderTabOnly("dua"); window.scrollTo({ top:0, behavior:"instant" }); });
  const dp = $("#duaPrev");
  if (dp) dp.addEventListener("click", ()=>{ if (detailDua > 0){ detailDua--; renderTabOnly("dua"); window.scrollTo({ top:0, behavior:"instant" }); } });
  const dn = $("#duaNext");
  if (dn) dn.addEventListener("click", ()=>{ if (detailDua < DUAS.length-1){ detailDua++; renderTabOnly("dua"); window.scrollTo({ top:0, behavior:"instant" }); } });
  const dm = $("#duaMk");
  if (dm) dm.addEventListener("click", ()=>{
    const on = marks.toggle("d", detailDua);
    dm.classList.toggle("on", on);
    const sp = dm.querySelector("span"); if (sp) sp.textContent = on ? "চিহ্নিত আছে ✓" : "চিহ্নিত রাখুন";
  });
  const dc = $("#duaCopy");
  if (dc) dc.addEventListener("click", async ()=>{
    const d = DUAS[detailDua]; if (!d) return;
    const sp = dc.querySelector("span"); const old = sp ? sp.textContent : "";
    const text = `${d.title}\n\n${d.ar}\n\nউচ্চারণ: ${d.uc}\n\nঅর্থ: ${d.bn}\nউৎস: ${d.src}\n— কুরআন ও হাদিস`;
    try { await navigator.clipboard.writeText(text); if (sp) sp.textContent = "কপি হয়েছে ✓"; }
    catch(e){ if (sp) sp.textContent = "কপি করা গেল না :("; }
    setTimeout(()=>{ if (sp) sp.textContent = old; }, 1800);
  });

  /* বুকমার্ক টগল (দোয়া/হাদিস — রিডার বাদে, সেটা bindReaderMarks দেখে) */
  [...document.querySelectorAll("[data-mk-kind]")].filter(el=>!el.closest("#readerBody")).forEach(b =>
    b.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      const kind = b.dataset.mkKind;
      const id = kind === "q" ? b.dataset.mkId : +b.dataset.mkId;
      const on = marks.toggle(kind, id);
      b.classList.toggle("on", on);
      b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse");
    })
  );

  /* চিহ্নিত পড়া পেজ — জাম্প ও সরানো */
  document.querySelectorAll(".mark-row").forEach(r =>
    r.addEventListener("click", () => jumpToMark(r.dataset.jump, r.dataset.id))
  );
  document.querySelectorAll(".mk-del").forEach(b =>
    b.addEventListener("click", e => {
      e.stopPropagation();
      marks.toggle(b.dataset.kind, b.dataset.kind === "q" ? b.dataset.id : +b.dataset.id);
      render();
    })
  );

  /* hadith */
  document.querySelectorAll(".hadith-open").forEach(b =>
    b.addEventListener("click", ()=>{
      const card = b.closest(".hadith-card");
      const i = +card.dataset.h;
      openHadiths.has(i) ? openHadiths.delete(i) : openHadiths.add(i);
      card.classList.toggle("open");
      b.childNodes[0].textContent = openHadiths.has(i) ? "আলোচনা লুকান " : "ব্যাখ্যা ও আলোচনা পড়ুন ";
    })
  );

  /* quran index */
  const qs = $("#quranSearch");
  if (qs) qs.addEventListener("input", e => {
    quranQuery = e.target.value;
    const pos = e.target.selectionStart;
    renderTabOnly("quran", ()=>{
      const el = $("#quranSearch");
      el.focus(); el.setSelectionRange(pos,pos);
    });
  });
  document.querySelectorAll(".surah-row").forEach(r =>
    r.addEventListener("click", ()=>{
      readerSurah = +r.dataset.surah;
      stopAudio();
      render();
      window.scrollTo({ top:0, behavior:"instant" });
    })
  );

  /* reader */
  const rb = $("#readerBack");
  if (rb) rb.addEventListener("click", ()=>{ readerSurah = null; stopAudio(); render(); });
  const ab = $("#audioBtn");
  if (ab) ab.addEventListener("click", ()=>toggleAudio(readerSurah));
  const pv = $("#prevSurah"); if (pv) pv.addEventListener("click", ()=>{ stopAudio(); readerSurah--; render(); window.scrollTo({top:0,behavior:"instant"}); });
  const nx = $("#nextSurah"); if (nx) nx.addEventListener("click", ()=>{ stopAudio(); readerSurah++; render(); window.scrollTo({top:0,behavior:"instant"}); });

  /* যোগাযোগ — ক্যারেক্টার কাউন্টার */
  const cMsg = $("#cMsg");
  if (cMsg) cMsg.addEventListener("input", () => {
    $("#charCount").textContent = `${bn(cMsg.value.length)} / ${bn(2000)}`;
  });

  /* যোগাযোগ — মেসেজ পাঠানো */
  const cForm = $("#contactForm");
  if (cForm) cForm.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = $("#sendBtn"), st = $("#sendStatus");
    const name  = $("#cName").value.trim();
    const phone = $("#cPhone").value.trim();
    const email = $("#cEmail").value.trim();
    const msg   = $("#cMsg").value.trim();

    const show = (kind, html) => {
      st.hidden = false;
      st.className = "send-status " + kind;
      st.innerHTML = html;
    };

    if (phone && !/^\+?[\d\s-]{6,16}$/.test(phone)){
      show("err", "মোবাইল নাম্বারটি সঠিক নয় — শুধু সংখ্যা লিখুন (যেমন: ০১XXXXXXXXX)।");
      $("#cPhone").focus();
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)){
      show("err", "ইমেইল ঠিকানাটি সঠিক নয় — যেমন: name@example.com");
      $("#cEmail").focus();
      return;
    }
    if (msg.length < 3){
      show("err", "অনুগ্রহ করে মেসেজে অন্তত কয়েকটি শব্দ লিখুন।");
      cMsg.focus();
      return;
    }

    /* ফলব্যাক-মেইল লিংক অগ্রিম তৈরি (নাম·মোবাইল·ইমেইলসহ) */
    const info = (name ? `নাম: ${name}\n` : "") + (phone ? `মোবাইল: ${phone}\n` : "") + (email ? `ইমেইল: ${email}\n` : "");
    const mailtoHref = "mailto:" + ADMIN.email
      + "?subject=" + encodeURIComponent("কুরআন ও হাদিস অ্যাপ — মেসেজ" + (name ? ` (${name})` : ""))
      + "&body=" + encodeURIComponent(info + "\n" + msg);

    /* মেইল অ্যাপ ফলব্যাক-লিংক */
    const mailLink = `<a class="mailto-fb" href="${mailtoHref}">মেইল অ্যাপে পাঠান</a>`;

    const doneReset = () => {
      btn.disabled = false;
      btn.classList.remove("busy");
      btn.querySelector("span").textContent = "মেসেজ পাঠান";
    };
    const sendOk = () => {
      cForm.reset();
      $("#charCount").textContent = "০ / ২০০০";
      show("ok", "জাযাকাল্লাহু খাইরান! আপনার মেসেজটি পাঠানো হয়েছে — ইনশাআল্লাহ শীঘ্রই জবাব পাবেন।");
    };

    /* APK (file://) থেকে সরাসরি ওয়েব-মেইল যায় না — মেইল অ্যাপেই পাঠাতে হবে */
    if (location.protocol === "file:"){
      show("warn", `আপনার মেসেজটি প্রস্তুত! নিচের বাটনে চাপ দিলে মেইল অ্যাপে সব তথ্যসহ লেখা থাকবে — সেখান থেকে <b>Send</b> চাপলেই সরাসরি এডমিনের ইনবক্সে পৌঁছে যাবে: ${mailLink}`);
      return;
    }

    /* ইন্টারনেট সংযোগ না থাকলে সাথে সাথে ফলব্যাক দেখান */
    if (navigator.onLine === false){
      show("warn", `আপনার ইন্টারনেট সংযোগ বন্ধ আছে — সংযোগ চালু করে আবার চেষ্টা করুন, অথবা এখান থেকে পাঠান: ${mailLink}`);
      return;
    }

    btn.disabled = true;
    btn.classList.add("busy");
    btn.querySelector("span").textContent = "পাঠানো হচ্ছে…";
    st.hidden = true;

    /* ফলব্যাক ২: CORS ছাড়াই — হিডেন iframe-এ ফর্ম POST */
    const iframePost = () => {
      const ifr = document.createElement("iframe");
      ifr.name = "fsFrame"; ifr.style.display = "none";
      const f = document.createElement("form");
      f.method = "POST"; f.action = "https://formsubmit.co/" + ADMIN.email;
      f.target = "fsFrame"; f.style.display = "none";
      const add = (k,v)=>{ const i=document.createElement("input"); i.type="hidden"; i.name=k; i.value=v; f.appendChild(i); };
      add("_subject", "কুরআন ও হাদিস অ্যাপ — নতুন মেসেজ" + (name ? ` (প্রেরক: ${name})` : ""));
      add("প্রেরকের নাম", name || "অনামী");
      add("মোবাইল", phone || "দেওয়া হয়নি");
      add("ইমেইল", email || "দেওয়া হয়নি");
      add("মেসেজ", msg);
      add("_template", "table");
      add("_captcha", "false");
      add("_replyto", email || "");
      add("_honey", "");
      let settled = false;
      const watchdog = setTimeout(()=>{
        if (settled) return; settled = true;
        ifr.remove(); f.remove();
        show("warn", `সরাসরি পাঠানো সম্ভব হয়নি — ইন্টারনেট সংযোগ পরীক্ষা করুন, অথবা এখান থেকে পাঠান: ${mailLink}`);
        doneReset();
      }, 15000);
      ifr.addEventListener("load", ()=>{
        if (settled) return; settled = true;
        clearTimeout(watchdog);
        setTimeout(()=>{ ifr.remove(); f.remove(); }, 400);
        sendOk();
        doneReset();
      });
      document.body.appendChild(ifr);
      document.body.appendChild(f);
      f.submit();
    };

    /* ফলব্যাক ১: AJAX (দ্রুততম) */
    try {
      const r = await fetch("https://formsubmit.co/ajax/" + ADMIN.email, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "কুরআন ও হাদিস অ্যাপ — নতুন মেসেজ" + (name ? ` (প্রেরক: ${name})` : ""),
          "প্রেরকের নাম": name || "অনামী",
          "মোবাইল": phone || "দেওয়া হয়নি",
          "ইমেইল": email || "দেওয়া হয়নি",
          "মেসেজ": msg,
          "অ্যাপ": "কুরআন ও হাদিস — ইসলামিক সঙ্গী",
          _replyto: email || "",
          _template: "table",
          _captcha: "false",
          _honey: ""
        })
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && (j.success === "true" || j.success === true)){
        sendOk();
        doneReset();
      } else {
        iframePost(); // AJAX রিজেক্ট করলে ফর্ম-পোস্ট চেষ্টা
      }
    } catch (err) {
      iframePost(); // নেটওয়ার্ক/CORS সমস্যায় ফর্ম-পোস্ট চেষ্টা
    }
  });

  /* amol */
  document.querySelectorAll(".amol-item").forEach(item =>
    item.addEventListener("click", ()=>{
      const i = +item.dataset.amol;
      const v = !amolStore.get(i);
      amolStore.set(i, v);
      item.classList.toggle("done", v);
      const items = AMOL[new Date().getDay()].items;
      const done = items.filter((_,k)=>amolStore.get(k)).length;
      const pct = Math.round(done / items.length * 100);
      const dash = 2 * Math.PI * 26;
      $("#ringFg").style.strokeDashoffset = dash * (1 - pct/100);
      $("#ringPct").textContent = bn(pct) + "%";
      $("#amolCount").textContent = `${bn(done)} / ${bn(items.length)} সম্পন্ন — ট্যাপ করে চিহ্নিত করুন`;
    })
  );
}

/* re-render only current tab (keeps search focus stable) */
function renderTabOnly(which, after){
  const v = $("#view");
  if (which === "dua") v.innerHTML = detailDua !== null ? pageDuaDetail() : pageDua();
  else if (which === "quran") v.innerHTML = readerSurah ? pageReaderShell() : pageQuran();
  bind();
  if (which === "quran" && readerSurah) loadSurahInto(readerSurah);
  if (after) after();
}

/* ---------------- APK ডাউনলোড কার্ড ---------------- */
function appDlCard(){
  /* APK বা Android WebView-র ভেতরে থাকলে কার্ডটি দেখাব না */
  if (location.protocol === "file:" || /;\s*wv\)/.test(navigator.userAgent)) return "";
  return `
  <section class="appdl pattern">
    <div class="appdl-ic">${I.android}</div>
    <div class="appdl-tx">
      <h3>মোবাইল অ্যাপ ডাউনলোড করুন</h3>
      <p>অ্যান্ড্রয়েড ফোনে ইনস্টল করুন — ইন্টারনেট চালু থাকলে ওয়েবসাইটের সব পরিবর্তন অ্যাপেও <b>নিজে নিজে আপডেট</b> হয়ে যাবে।</p>
    </div>
    <a class="dlbtn" href="/quran-o-hadis.apk" download="quran-o-hadis.apk">${I.dl} APK ডাউনলোড</a>
    <div class="appdl-note">ডাউনলোড শেষে ফাইলে চাপ দিয়ে <b>Install</b> করুন — "অজানা উৎস" (Unknown sources) অনুমতি চাইতে পারে · Android ৫.০+</div>
  </section>`;
}

/* ---------------- footer ---------------- */
function footNote(){
  return `
  <footer class="foot">
    <div class="ar" lang="ar">رَبِّ زِدْنِي عِلْمًا</div>
    <p>“হে আমার প্রতিপালক! আমার জ্ঞান বৃদ্ধি করুন” — ত্বাহা: ১১৪<br>
    উৎস: আল-কুরআন, সহীহ বুখারি-মুসলিমসহ প্রমাণিত গ্রন্থাবলি। ভুল-ত্রুটি থাকলে জানালে কৃতজ্ঞ থাকব।</p>
  </footer>`;
}

/* ---------------- live clock ---------------- */
function startClock(){
  const tick = ()=>{
    const t = $("#clockTime");
    if (!t) return;
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes(), s = now.getSeconds();
    const h12 = h % 12 === 0 ? 12 : h % 12;
    t.textContent = bn(String(h12).padStart(2,"0")) + ":" + bn(String(m).padStart(2,"0"));
    $("#clockSecs").textContent = bn(String(s).padStart(2,"0"));
    $("#clockPeriod").textContent = dayPeriod(h);
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------------- boot ---------------- */
/* ?tab= / ?dua= ডিপ-লিংক (শেয়ারযোগ্য সরাসরি লিংক) */
try {
  const qp = new URLSearchParams(location.search);
  const qt = qp.get("tab"); if (qt && TABS.some(t=>t.id===qt)) tab = qt;
  const qdi = qp.get("dua"); if (qdi !== null && qdi !== "" && DUAS[+qdi]) { tab = "dua"; detailDua = +qdi; }
} catch(e){}

render();
startClock();
syncAjkerTarikh();
