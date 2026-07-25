// Vercel Serverless Function
// Reads the current CounterAPI "site-visits" count using the secret token.
// Used by the private /team-stats.html page so the owner can view visits
// without ever seeing or needing the CounterAPI token.

export default async function handler(req, res) {
  try {
    const token = process.env.COUNTERAPI_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Missing COUNTERAPI_TOKEN env var" });
    }

    const response = await fetch(
      "https://api.counterapi.dev/v2/site-visitEd/site-visitEd",
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
