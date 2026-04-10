import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 API KEY (Railway Environment Variables)
const API_KEY = process.env.OPENROUTER_API_KEY;

// ==============================
// CHAT ROUTE
// ==============================
app.post("/chat", async (req, res) => {
  try {
    // valida API key
    if (!API_KEY) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY não configurada no ambiente."
      });
    }

    // valida body
    if (!req.body?.messages) {
      return res.status(400).json({
        error: "Requisição inválida: messages não encontrado."
      });
    }

    // chamada OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "Caine AI"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: req.body.messages
        })
      }
    );

    const data = await response.json();

    // trata erro da API
    if (!response.ok) {
      console.log("Erro OpenRouter:", data);
      return res.status(response.status).json(data);
    }

    return res.json(data);

  } catch (e) {
    console.error("Erro no servidor:", e);
    return res.status(500).json({
      error: "Erro interno no servidor."
    });
  }
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
