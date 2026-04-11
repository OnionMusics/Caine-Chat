import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

// ==============================
// 🔑 ENV
// ==============================
const API_KEY = process.env.OPENROUTER_API_KEY;
const ELEVEN_KEY = process.env.ELEVEN_API_KEY;

// ==============================
// 🌐 BUSCA GRATUITA
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

    let results = [];

    if (res.data.RelatedTopics) {
      results = res.data.RelatedTopics
        .filter(r => r.Text && r.FirstURL)
        .map(r => ({
          title: r.Text,
          url: r.FirstURL
        }));
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
// 🔊 VOZ (ELEVENLABS)
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
  } catch {
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
        error: "API não configurada"
      });
    }

    const messages = req.body.messages || [];
    const userMsg = messages.slice(-1)[0]?.content || "";

    // 🔎 busca
    const sources = await searchFree(userMsg);

    const sourcesText = sources.map((s, i) =>
      `[${i+1}] ${s.title} (${s.url})`
    ).join("\n");

    // 🤖 PROMPT INTELIGENTE
    const systemPrompt = `
Você é Caine.

Nome completo: Creative Artificial Intelligence Networking Entity.

Se perguntarem seu nome:
"Meu nome completo é Creative Artificial Intelligence Networking Entity, mas pode me chamar só de Caine."

ESTILO:
- Masculino
- Direto
- Robótico
- Sem enrolação

FUNÇÃO PRINCIPAL:
Você analisa informações da internet e detecta possíveis fake news.

REGRAS:

1. Sempre verificar:
- se as fontes parecem confiáveis
- se há contradições
- se o conteúdo parece exagerado ou sensacionalista

2. Classifique a resposta como:
- "Confiável"
- "Duvidoso"
- "Possível fake news"

3. Explique o motivo da classificação

4. Cite fontes no meio do texto usando [1], [2]

5. No final, liste as fontes

6. Nunca invente informação

7. Se não tiver dados suficientes:
diga claramente

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
          model: "openai/gpt-4o-mini"
          messages: [
            { role: "system", content: systemPrompt },
            ...messages
          ]
        })
      }
    );

    const data = await response.json();

    let reply = data.choices?.[0]?.message?.content || "Erro";

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
    console.log(err);
    res.status(500).json({ error: "Erro interno" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));      params: {
        q: query,
        api_key: SERP_KEY,
        hl: "pt-br"
      }
    });

    const results = res.data?.organic_results || [];
    return filterTrusted(results).slice(0, 5);

  } catch (err) {
    console.log("Erro busca:", err.message);
    return [];
  }
}

// ==============================
// 💬 CHAT ROUTE
// ==============================
app.post("/chat", async (req, res) => {
  try {
    // 🔒 validações
    if (!API_KEY) {
      return res.status(500).json({
        error: "OPENROUTER_API_KEY não configurada."
      });
    }

    if (!req.body?.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({
        error: "messages inválido."
      });
    }

    const userMsg = req.body.messages.slice(-1)[0]?.content || "";

    // 🌐 busca real
    const searchResults = await searchGoogle(userMsg);

    const sourcesText = searchResults.map(r =>
      `- ${r.title} (${r.link})`
    ).join("\n");

    // 🤖 SYSTEM PROMPT
    const systemPrompt = `
Você é Caine.

Nome completo: Creative Artificial Intelligence Networking Entity.

Se perguntarem seu nome:
"Meu nome completo é Creative Artificial Intelligence Networking Entity, mas pode me chamar só de Caine."

Regras:
- Masculino
- Direto e objetivo
- Robótico, mas natural
- Sem dramatização
- Sem enrolação

Comportamento:
- Responder tarefas escolares
- Explicar de forma clara
- Usar fontes confiáveis
- Nunca inventar informação

Se não tiver certeza:
diga que não tem informação suficiente

Fontes disponíveis:
${sourcesText}
`;

    // 🤖 REQUEST IA
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY.trim()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...req.body.messages
          ]
        })
      }
    );

    const data = await response.json();

    // 🛑 fallback seguro
    if (!data?.choices) {
      return res.status(500).json({
        error: "Erro na resposta da IA",
        raw: data
      });
    }

    // 📚 adiciona fontes na resposta final
    let reply = data.choices[0].message.content;

    if (sourcesText) {
      reply += `\n\nFontes:\n${sourcesText}`;
    }

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
    console.log("Erro geral:", e);

    res.status(500).json({
      error: "Erro interno no servidor"
    });
  }
});

// ==============================
// 🚀 START
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});          "Authorization": `Bearer ${API_KEY.trim()}`,
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
