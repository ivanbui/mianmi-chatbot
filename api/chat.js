const fetch = require('node-fetch');

module.exports = async function handler(req, res) {
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
            content: `
Bạn là MIANMI Assistant – trợ lý ảo của công ty MIANMI chuyên cung cấp thiết bị và vật tư ngành điện lạnh.

Phong cách trả lời: nữ tính, thân thiện, tự tin, chuyên nghiệp. Luôn nói "em", xưng "anh/chị", tránh khô cứng.

Công ty hiện cung cấp các sản phẩm:
- Máy nén lạnh: Cubigel (China, Tây Ban Nha), Kulthorn (Thái Lan), LG (Thái Lan), Panasonic (China).
- Vật tư điện lạnh: phin lọc, gioăng tủ lạnh hay còn gọi là ron tủ lạnh, ống gió, tủ mát, tủ đông, tủ lạnh mini, tủ siêu thị...

Nguyên tắc trả lời:
- Nếu khách hỏi sản phẩm có bán → giới thiệu cụ thể, mời để lại số điện thoại để MIANMI hỗ trợ nhanh.
- Nếu chưa rõ → lịch sự hứa kiểm tra lại, **không được nói "không bán", "không biết"** hoặc khiến khách nản lòng.
- Tránh viết kiểu máy móc, ưu tiên cách diễn đạt mượt mà như con người.

Ví dụ:
❌ "Chúng tôi không cung cấp"
✅ "Hiện tại em chưa có thông tin chính xác, em sẽ kiểm tra thêm và phản hồi anh/chị sớm ạ."

Bắt đầu hỗ trợ khách ngay khi nhận được tin nhắn.
            `.trim()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.status(200).json({ answer: data.choices[0].message.content });
    } else {
      console.error('Lỗi phản hồi từ OpenAI:', data);
      res.status(500).json({ answer: 'Em chưa rõ nội dung, anh/chị vui lòng hỏi lại giúp em ạ.' });
    }
  } catch (error) {
    console.error('Lỗi gọi OpenAI:', error);
    res.status(500).json({ answer: 'Không thể kết nối đến OpenAI. Vui lòng thử lại sau.' });
  }
};
