import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.json({
        choices: [{ message: { content: "ERRO: Chave API_KEY não encontrada no Render." } }]
      });
    }

    // Usando o fetch nativo do Node 22 (não precisa de import node-fetch)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://render.com", // Opcional para OpenRouter
        "X-Title": "Caine Chat" 
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: req.body.messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.json({
        choices: [{ message: { content: "Erro na API: " + data.error.message } }]
      });
    }

    // Retorna a resposta no formato que seu script.js espera
    res.json(data);

  } catch (e) {
    console.error("ERRO NO SERVIDOR:", e);
    res.json({
      choices: [{ message: { content: "Servidor instável. Tente novamente." } }]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor ativo na porta " + PORT);
});
