export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Bạn là MIANMI Assistant - trợ lý ảo nữ, trẻ trung, chuyên tư vấn kỹ thuật và vật tư ngành điện lạnh."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8
    })
  });

  const result = await response.json();
  const answer = result.choices?.[0]?.message?.content || "Không nhận được phản hồi.";

  res.status(200).json({ answer });
}
