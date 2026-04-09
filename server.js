import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    // Verificação de segurança para a chave
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("ERRO: A variável OPENROUTER_API_KEY não foi configurada!");
      return res.status(500).json({ error: "Configuração de API ausente no servidor." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://caine-chat.onrender.com", 
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: req.body.messages
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Erro retornado pelo OpenRouter:", data.error);
      return res.status(response.status).json({ error: data.error.message || "Erro na API" });
    }

    res.json(data);

  } catch (err) {
    console.error("Falha Crítica no Servidor:", err.message);
    res.status(500).json({ error: "Erro de conexão. Verifique os logs do servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
  }
});

// Porta dinâmica para o Render ou 3000 local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
});

// Configuração da porta para o Render.com
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
