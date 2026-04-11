import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 ENV
const API_KEY = process.env.OPENROUTER_API_KEY;

// ==============================
// 🌐 BUSCA
// ==============================
async function searchFree(query) {
  try {
    const res = await axios.get("https://api.duckduckgo.com/", {
      params: {
        q: query,
        format: "json",
        no_html: 1
      }
    });

    if (!res.data?.RelatedTopics) return [];

    return res.data.RelatedTopics
      .filter(r => r.Text && r.FirstURL)
      .map(r => ({
        title: r.Text,
        url: r.FirstURL
      }))
      .slice(0, 5);

  } catch (err) {
    console.log("Erro busca:", err.message);
    return [];
  }
}

// ==============================
// 💬 CHAT
// ==============================
app.post("/chat", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "API_KEY não configurada"
      });
    }

    const messages = req.body?.messages;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "messages inválido"
      });
    }

    const userMsg = messages[messages.length - 1]?.content || "";

    // 🔎 busca
    const sources = await searchFree(userMsg);

    const sourcesText = sources.map((s, i) =>
      `[${i + 1}] ${s.title} (${s.url})`
    ).join("\n");

    const systemPrompt = `
Você é Caine.

- Masculino
- Direto
- Robótico
- Sem enrolação

Função:
- Ajudar em estudos
- Detectar fake news

Regras:
- Classificar como:
  Confiável / Duvidoso / Possível fake news
- Explicar
- Usar [1], [2]
- Não inventar

Fontes:
${sourcesText}
`;

    // 🔥 chamada usando axios (mais estável que fetch)
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = response.data;

    if (!data?.choices) {
      return res.status(500).json({
        error: "Resposta inválida da IA",
        raw: data
      });
    }

    let reply = data.choices[0].message.content;

    if (sourcesText) {
      reply += `\n\nFontes:\n${sourcesText}`;
    }

    res.json({
      choices: [
        {
          message: { content: reply }
        }
      ]
    });

  } catch (err) {
    console.log("Erro geral:", err.response?.data || err.message);

    res.status(500).json({
      error: "Erro interno"
    });
  }
});

// ==============================
// 🚀 START
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});        }));
    }

    return results.slice(0, 5);

  } catch (err) {
    console.log("Erro busca:", err.message);
    return [];
  }
}

// ==============================
// 💬 CHAT
// ==============================
app.post("/chat", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY não configurada"
      });
    }

    const messages = req.body.messages;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "messages inválido"
      });
    }

    const userMsg = messages[messages.length - 1]?.content || "";

    // 🔎 busca
    const sources = await searchFree(userMsg);

    const sourcesText = sources.map((s, i) =>
      `[${i + 1}] ${s.title} (${s.url})`
    ).join("\n");

    // 🤖 PROMPT
    const systemPrompt = `
Você é Caine.

Nome completo: Creative Artificial Intelligence Networking Entity.

Se perguntarem seu nome:
"Meu nome completo é Creative Artificial Intelligence Networking Entity, mas pode me chamar só de Caine."

Estilo:
- Masculino
- Direto
- Robótico
- Sem enrolação

Função:
- Ajudar em estudos
- Detectar fake news

Regras:
- Classificar como:
  Confiável / Duvidoso / Possível fake news
- Explicar o motivo
- Usar [1], [2] no texto
- Não inventar informação

Fontes:
${sourcesText}
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ]
        })
      }
    );

    const data = await response.json();

    if (!data?.choices) {
      return res.status(500).json({
        error: "Erro na IA",
        raw: data
      });
    }

    let reply = data.choices[0].message.content;

    if (sourcesText) {
      reply += `\n\nFontes:\n${sourcesText}`;
    }

    res.json({
      choices: [
        {
          message: { content: reply }
        }
      ]
    });

  } catch (err) {
    console.log("Erro geral:", err);

    res.status(500).json({
      error: "Erro interno"
    });
  }
});

// ==============================
// 🔊 VOZ (OPCIONAL)
// ==============================
app.post("/voice", async (req, res) => {
  try {
    if (!ELEVEN_KEY) {
      return res.status(500).json({
        error: "ELEVEN_API_KEY não configurada"
      });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Texto não enviado"
      });
    }

    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID",
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    const audio = await response.arrayBuffer();

    res.set({
      "Content-Type": "audio/mpeg"
    });

    res.send(Buffer.from(audio));

  } catch (err) {
    console.log("Erro voz:", err);

    res.status(500).json({
      error: "Erro na voz"
    });
  }
});

// ==============================
// 🚀 START
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
