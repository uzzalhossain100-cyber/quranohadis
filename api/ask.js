/* জেমিনি AI সার্ভার-প্রক্সি — কী সার্ভারে গোপন থাকে (Vercel env: GEMINI_API_KEY)
   ক্লায়েন্ট: POST /api/ask  { q, ctx }  →  { answer } */

const MODELS = (process.env.GEMINI_MODEL || "gemini-2.5-flash,gemini-3.1-flash-lite,gemini-flash-lite-latest,gemini-3-flash-preview")
  .split(",").map(s => s.trim()).filter(Boolean);

function buildPrompt(q, ctx){
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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-qa-client");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "method-not-allowed" }); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(501).json({ error: "no-key" }); return; }

  let body = req.body;
  if (typeof body === "string"){
    try { body = JSON.parse(body); } catch(e){ body = {}; }
  }
  const q = String((body && body.q) || "").slice(0, 600).trim();
  const ctx = String((body && body.ctx) || "").slice(0, 3500);
  if (!q) { res.status(400).json({ error: "empty-q" }); return; }

  const prompt = buildPrompt(q, ctx);
  let lastErr = "";
  for (const model of MODELS){
    try {
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(key),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.25, maxOutputTokens: 1400 }
          })
        }
      );
      if (!r.ok){ lastErr = model + ":" + r.status; continue; }
      const j = await r.json();
      const cand = (j && j.candidates && j.candidates[0]) || {};
      const parts = (cand.content && cand.content.parts) || [];
      const txt = parts.map(p => p.text || "").join("").trim();
      if (txt){ res.status(200).json({ answer: txt, model: model }); return; }
      lastErr = model + ":empty";
    } catch(e){
      lastErr = model + ":" + (e && e.message ? e.message : "err");
    }
  }
  res.status(502).json({ error: "gemini-failed", detail: lastErr });
};
