const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Anh thay bằng API key của anh

app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
const prompt = req.body.prompt;
try {
const response = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${OPENAI_API_KEY}`,
},
body: JSON.stringify({
model: 'gpt-3.5-turbo',
messages: [{ role: 'user', content: prompt }],
max_tokens: 150,
}),
});
const data = await response.json();
res.json({ answer: data.choices[0].message.content });
} catch (error) {
res.status(500).json({ answer: 'Lỗi kết nối API' });
}
});

app.listen(PORT, () => {
console.log(`Server chạy tại port ${PORT}`);
});
