export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body;
  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      })
    });
    const data = await completion.json();
    res.status(200).json({ answer: data.choices?.[0]?.message?.content || 'Không có phản hồi.' });
  } catch {
    res.status(500).json({ answer: 'Lỗi kết nối API' });
  }
}