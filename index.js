import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    // Tenta pegar do Render, se não tiver, usa a que você colar aqui
    const MINHA_CHAVE_RESERVA = "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"; 
    const key = process.env.OPENROUTER_API_KEY || MINHA_CHAVE_RESERVA;

    if (!key || key === "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) {
      return res.status(500).json({ error: 'Chave API ausente. Cole a chave no server.js ou no Render.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: req.body.messages
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando'));
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
