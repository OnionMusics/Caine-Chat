import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// LISTA DE MODELOS (DO MAIS DESEJADO PARA O MAIS ESTÁVEL/BARATO)
const MODEL_PRIORITY = [
  "openai/gpt-3.5-turbo",
  "google/gemini-2.0-flash-lite-001", // Modelo grátis/barato e muito rápido
  "anthropic/claude-3-haiku",
  "mistralai/mistral-7b-instruct"
];

app.post('/chat', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: "Configuração ausente: adicione OPENROUTER_API_KEY no Render." });
  }

  // TENTA CADA MODELO DA LISTA ATÉ UM FUNCIONAR
  for (const model of MODEL_PRIORITY) {
    try {
      console.log(`Tentando modelo: ${model}...`);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://caine-ai.render.com',
          'X-Title': 'Caine AI Dynamic'
        },
        body: JSON.stringify({
          model: model,
          messages: req.body.messages,
          max_tokens: 500
        })
      });

      const data = await response.json();

      // Se a resposta for positiva, envia ao usuário e encerra o loop
      if (response.ok && data.choices) {
        console.log(`Sucesso com: ${model}`);
        return res.json(data);
      } 
      
      console.warn(`Modelo ${model} falhou: ${data.error?.message || 'Erro desconhecido'}`);
      
    } catch (err) {
      console.error(`Erro de conexão com ${model}:`, err.message);
    }
  }

  // Se passar por todos e nenhum funcionar
  res.status(500).json({ error: "Todos os modelos de IA falharam. Verifique seu saldo no OpenRouter." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor blindado na porta ' + PORT));
