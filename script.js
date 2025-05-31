const chatBox = document.getElementById('chat-box');
const input = document.getElementById('userInput');
const btn = document.getElementById('sendBtn');

const serverUrl = 'https://mianmi-chatbot.vercel.app/api/chat';

function addMessage(text, className) {
  const div = document.createElement('div');
  div.textContent = text;
  div.className = className;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

btn.onclick = async () => {
  const msg = input.value;
  if (msg) {
    addMessage(msg, 'user');
    input.value = '';
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: msg })
      });
      const data = await response.json();
      addMessage(data.answer, 'bot');
    } catch {
      addMessage('Lỗi kết nối với trợ lý.', 'bot');
    }
  }
};
