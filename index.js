import express from "express";
import cors from "cors";
import { chat, chatStream } from "./engine.js";
import { getMorningMessage } from "./personality.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  const response = await chat(message, userId);

  res.json({ response });
});

app.post("/chat-stream", async (req, res) => {
  await chatStream(req, res);
});

app.get("/startup-message", (req, res) => {
  const msg = getMorningMessage();
  res.json({ message: msg });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 Caine AI rodando"));
