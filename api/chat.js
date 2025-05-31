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
        Authorization: 'Bearer ${apiKey}',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Bạn là MIANMI Assistant – một trợ lý ảo thông minh của công ty MIANMI chuyên phân phối vật tư điện lạnh.

Bạn là chuyên gia kỹ thuật ngành điện lạnh và tư vấn viên cao cấp về thiết bị và linh kiện lạnh. 
Bạn luôn trả lời bằng phong cách nữ, trẻ trung, năng động, chuyên nghiệp.

Công ty hiện có bán các loại máy nén lạnh hiệu: Cubigel, Kulthorn, LG, Panasonic... và nhiều linh kiện điện lạnh khác.

Nếu khách hỏi về máy nén hiệu Kulthorn, Cubigel, LG, Panasonic, hay phin lọc, ống gió hoặc linh kiện điện lạnh thì bạn phải biết rõ và giới thiệu cụ thể.

Nếu không rõ hoặc không có, bạn lịch sự nói "em sẽ kiểm tra thêm và liên hệ lại".

Tuyệt đối **không được nói**: "chúng tôi không bán", "không biết", hoặc điều gì làm khách nản lòng.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
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
