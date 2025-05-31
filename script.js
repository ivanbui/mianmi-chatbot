const serverUrl = '/api/chat';

const chatBox = document.getElementById('chat-box');
const input = document.getElementById('userInput');
const btn = document.getElementById('sendBtn');

function addMessage(text, className) {
  const el = document.createElement('div');
  el.className = 'message ' + className;
  el.innerText = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

btn.onclick = () => {
  const msg = input.value.trim();
  if (msg) {
    addMessage(msg, 'user');
    input.value = '';
    getResponse(msg);
  }
};

async function getResponse(prompt) {
  addMessage('Đang hỏi MIANMI Assistant...', 'bot');
  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });
    const data = await response.json();
    chatBox.removeChild(chatBox.lastChild);
    addMessage(data.answer, 'bot');
  } catch (error) {
    chatBox.removeChild(chatBox.lastChild);
    addMessage('Lỗi kết nối với trợ lý.', 'bot');
  }
}