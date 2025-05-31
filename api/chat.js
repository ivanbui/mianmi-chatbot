const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
  // Xử lý CORS cho mọi request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Xử lý preflight request từ browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Chỉ chấp nhận phương thức POST cho thực thi chính
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
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Bạn là MIANMI Assistant – trợ lý ảo thông minh, nữ, trẻ trung, nhiệt tình, chuyên tư vấn về máy nén lạnh Cubigel, Kulthorn, LG, Panasonic...`,
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ answer: data.choices[0].message.content });
    } else {
      console.error('Lỗi từ OpenAI:', data);
      res.status(500).json({ answer: 'Không có phản hồi từ OpenAI.' });
    }
  } catch (error) {
    console.error('Lỗi gọi OpenAI:', error);
    res.status(500).json({ answer: 'Không thể kết nối tới OpenAI.' });
  }
};
