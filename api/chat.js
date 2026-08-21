export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { model, messages, temperature, max_tokens } = req.body;

    const response = await fetch("https://ollama.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || "qwen2.5:1.5b-instruct",
        messages: messages || [],
        temperature: temperature ?? 0.3,
        max_tokens: max_tokens ?? 350,
      }),
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Ollama API error:", error);

    return res.status(500).json({
      error: "Failed to connect to Ollama Cloud",
      details: error.message,
    });
  }
}
