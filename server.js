import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Modelo mais estável
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Erro de conexão" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor Online"));
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
