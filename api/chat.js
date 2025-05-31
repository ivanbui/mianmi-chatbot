export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ answer: 'Chỉ chấp nhận phương thức POST' });
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ answer: 'Thiếu API key' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ answer: data.choices[0].message.content });
    } else {
      console.error('Lỗi dữ liệu từ OpenAI:', data);
      res.status(500).json({ answer: 'Không có phản hồi từ OpenAI.' });
    }
  } catch (error) {
    console.error('Lỗi gọi OpenAI:', error);
    res.status(500).json({ answer: 'Không thể kết nối tới OpenAI.' });
  }
}
