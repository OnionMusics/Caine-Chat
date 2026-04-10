import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Forçando a chave direto aqui para evitar o erro de "Falta chave no Render"
const API_KEY = "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";

app.post('/chat', async (req, res) => {
    try {
        if (!API_KEY || API_KEY.includes("SUA_CHAVE")) {
            return res.status(500).json({ error: "Chave não configurada no server.js" });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY.trim()}`,
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
        res.status(500).json({ error: "Erro no servidor: " + err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.log("Erro servidor:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});
