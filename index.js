app.post("/chat-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { message } = req.body;

  const response = await openAIProvider(message);

  const words = response.split(" ");

  for (const word of words) {
    res.write(`data: ${word} \n\n`);
    await new Promise(r => setTimeout(r, 40)); // efeito digitação
  }

  res.write("data: [DONE]\n\n");
  res.end();
});
