import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "OPENROUTER_API_KEY não configurada no Render." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
    });

    const data = await response.json();

    // 👇 DEBUG IMPORTANTE
    if (!response.ok) {
      console.log("Erro OpenRouter:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro de conexão no servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor Online"));
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
