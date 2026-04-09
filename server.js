import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://seusite.com", // Opcional, exigido por alguns modelos no OpenRouter
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: req.body.messages
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro da API OpenRouter:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);

  } catch (err) {
    console.error("Erro interno no servidor:", err.message);
    res.status(500).json({ error: "Erro ao processar a requisição." });
  }
});

// Configuração da porta para o Render.com
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
