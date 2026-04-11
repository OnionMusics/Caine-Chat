import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 ENV
const API_KEY = process.env.OPENROUTER_API_KEY;
const SERP_KEY = process.env.SERPAPI_KEY;

// ==============================
// 🛡️ FUNÇÃO FILTRO DE FONTES
// ==============================
function filterTrusted(results = []) {
  return results.filter(r =>
    r.link?.includes(".edu") ||
    r.link?.includes(".gov") ||
    r.link?.includes("wikipedia") ||
    r.link?.includes("bbc") ||
    r.link?.includes("g1") ||
    r.link?.includes("uol") ||
    r.link?.includes("globo")
  );
}

// ==============================
// 🌐 BUSCA REAL
// ==============================
async function searchGoogle(query) {
  try {
    if (!SERP_KEY) return [];

    const res = await axios.get("https://serpapi.com/search.json", {
      params: {
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
