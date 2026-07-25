// Vercel Serverless Function
// Increments the CounterAPI "site-visits" counter using a secret token
// that is stored ONLY as a Vercel Environment Variable (never exposed to the browser).

export default async function handler(req, res) {
  try {
    const token = process.env.COUNTERAPI_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Missing COUNTERAPI_TOKEN env var" });
    }

    const response = await fetch(
      "https://api.counterapi.dev/v2/site-visitEd/site-visitEd/up",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
