import express from 'express';
import cors from 'cors';

// COLE SUA CHAVE DENTRO DAS ASPAS ABAIXO (sk-or-v1-...)
const CHAVE_MESTRA = "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"; 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    // Tenta pegar do sistema, se não achar, usa a CHAVE_MESTRA que você colou acima
    const key = process.env.OPENROUTER_API_KEY || CHAVE_MESTRA;

    if (!key || key === "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") {
      return res.status(500).json({ error: 'Erro: Você esqueceu de colar a chave no código server.js' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: req.body.messages
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: 'OpenRouter diz: ' + data.error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor Online'));
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
