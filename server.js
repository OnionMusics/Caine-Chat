import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const key = process.env.OPENROUTER_API_KEY;

    if (!key) {
      return res.status(500).json({ error: 'Falta chave no Render' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://caine-chat.onrender.com',
        'X-Title': 'Caine AI'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // 🔥 modelo gratuito
        messages: req.body.messages
      })
    });

    const data = await response.json();

    // 🔥 DEBUG IMPORTANTE
    if (data.error) {
      console.log("Erro OpenRouter:", data.error);
      return res.status(500).json(data);
    }

    res.json(data);

  } catch (err) {
    console.log("Erro servidor:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
