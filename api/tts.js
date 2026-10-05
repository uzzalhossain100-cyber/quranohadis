/* ভার্সেল সার্ভারলেস: Google Translate TTS-এর অডিও প্রক্সি
   ডিভাইস/আইএসপি থেকে translate.googleapis.com সরাসরি না পৌঁছালেও
   এই এন্ডপয়েন্ট সার্ভার-সাইড থেকে অডিও এনে দেয়। */
const https = require("https");

module.exports = (req, res) => {
  try {
    const url = new URL(req.url, "https://x.local");
    const q = (url.searchParams.get("q") || "").trim().slice(0, 190);
    const tl = url.searchParams.get("tl") === "ar" ? "ar" : "bn";
    if (!q) { res.statusCode = 400; res.end("no text"); return; }
    const upstream = "https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&total=1&idx=0&textlen="
      + String(q.length) + "&tl=" + tl + "&q=" + encodeURIComponent(q);
    const opts = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://translate.google.com/",
      },
    };
    const up = https.get(upstream, opts, (r) => {
      if (r.statusCode !== 200) {
        res.statusCode = r.statusCode === 404 ? 502 : (r.statusCode || 502);
        r.resume();
        res.end("upstream error");
        return;
      }
      res.setHeader("Content-Type", r.headers["content-type"] || "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Access-Control-Allow-Origin", "*");
      if (r.headers["content-length"]) res.setHeader("Content-Length", r.headers["content-length"]);
      res.statusCode = 200;
      r.pipe(res);
    });
    up.setTimeout(9000, () => { up.destroy(new Error("timeout")); });
    up.on("error", () => { if (!res.headersSent) { res.statusCode = 502; } res.end(); });
  } catch (e) {
    res.statusCode = 500; res.end("err");
  }
};
