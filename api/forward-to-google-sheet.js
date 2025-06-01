export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzyXnz_riaGxsZLZH7S-Ne-a2TydS152L-BoD_P6U2Onb_C9tNOX4jPLh9lvg_cNWAi6Q/exec';

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    res.status(200).json({ success: true, response: json });
  } catch (err) {
    console.error('Forward error:', err);
    res.status(500).json({ error: 'Failed to forward request to Google Script' });
  }
}