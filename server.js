import express from 'express';
import cors from 'cors';

const CHAVE_FORCADA = "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"; 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAVE_FORCADA.trim()}`,
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
app.listen(PORT, () => console.log('Servidor OK'));
      return res.status(500).json(data);
    }

    res.json(data);

  } catch (err) {
    console.log("Erro servidor:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
