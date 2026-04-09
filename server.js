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
        "Authorization": "Bearer " + process.env.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: req.body.messages
      })
    });

    const data = await response.json();
    console.log("OPENROUTER:", data);

    let reply = "Erro na IA 😵";

    // ✅ trata resposta normal
    if (data.choices && data.choices.length > 0) {
      reply = data.choices[0].message?.content || reply;
    }

    // ❌ trata erro vindo da API
    if (data.error) {
      reply = "Erro: " + data.error.message;
    }

    // 🔄 SEMPRE retorna padrão compatível com seu frontend
    res.json({
      choices: [
        {
          message: {
            content: reply
          }
        }
      ]
    });

  } catch (e) {
    console.log("ERRO:", e);
    res.json({
      choices: [
        {
          message: {
            content: "Erro de conexão com servidor 🚫"
          }
        }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});
