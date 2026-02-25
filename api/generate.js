// /api/generate.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Falta el prompt" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Falta ANTHROPIC_API_KEY en las variables de entorno de Vercel",
      });
    }

    const payload = {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          // Anthropic espera content como array de bloques (recomendado)
          content: [{ type: "text", text: prompt }],
        },
      ],
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Anthropic error:", response.status, data);
      return res.status(response.status).json({
        error: "Error al conectar con la IA",
        detail: data,
      });
    }

    // Devolvemos directamente lo que viene de Anthropic
    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
