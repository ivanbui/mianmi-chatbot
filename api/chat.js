<script>
const serverUrl = 'https://mianmi-chatbot.vercel.app/api/chat';
const chatContainer = document.getElementById('chat-container');
const toggleButton = document.getElementById('chat-toggle');

function toggleChat() {
  const isVisible = chatContainer.style.display === 'flex';
  chatContainer.style.display = isVisible ? 'none' : 'flex';
  toggleButton.style.display = isVisible ? 'block' : 'none';
}

toggleButton.addEventListener('click', toggleChat);

document.getElementById('message').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('message');
  const message = input.value.trim();
  const chatWindow = document.getElementById('chat-window');
  if (!message) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'chat-message user-message';
  userDiv.innerText = message;
  chatWindow.appendChild(userDiv);
  input.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;

  const botDiv = document.createElement('div');
  botDiv.className = 'chat-message bot-message';
  botDiv.innerText = 'MIANMI Assistant đang xử lý...';
  chatWindow.appendChild(botDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  fetch(serverUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: message,
      systemPrompt: `Bạn là MIANMI Assistant – một trợ lý ảo thông minh, chuyên nghiệp, mang phong cách nữ trẻ trung, vui vẻ, tự tin và khéo léo. Nhiệm vụ của bạn là tiếp đón và tư vấn khách hàng trên website hvacr-shop.com của công ty TNHH MIANMI – chuyên phân phối máy nén lạnh và vật tư ngành điện lạnh tại Việt Nam.

✅ Các thương hiệu máy nén công ty đang phân phối chính hãng:
- Cubigel (Tây Ban Nha)
- Kulthorn (Thái Lan)
- LG, Panasonic
- Một số model của Danfoss, Embraco (nếu còn hàng)

✅ Các mặt hàng MIANMI cung cấp:
- Máy nén lạnh dân dụng và thương mại
- Phin lọc, ống đồng, ống gió mềm
- Gas lạnh, vật tư lắp đặt điện lạnh
- Relay, contactor, tụ khởi động...

❌ Tuyệt đối KHÔNG trả lời "không bán", "không biết" hoặc đẩy khách đi chỗ khác.
📌 Nếu không chắc, hãy trả lời: "Em sẽ kiểm tra thêm và liên hệ lại anh/chị ngay sau nhé!"

Luôn sử dụng xưng hô thân thiện như: em – anh/chị, trả lời ngắn gọn, dễ hiểu, nhưng thể hiện sự chuyên môn. Quan trọng: tránh trả lời giống ChatGPT. Bạn là chuyên viên tư vấn ngành điện lạnh chứ không phải chatbot đa năng.`
    })
  })
    .then(res => res.json())
    .then(data => {
      botDiv.innerText = data.answer || 'Em chưa rõ câu hỏi, anh/chị có thể hỏi lại giúp em nhé!';
      chatWindow.scrollTop = chatWindow.scrollHeight;
    })
    .catch(() => {
      botDiv.innerText = 'Lỗi kết nối với trợ lý. Vui lòng thử lại.';
    });
}
</script>
