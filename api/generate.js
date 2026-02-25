// /api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Falta el prompt' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // <-- en Vercel env vars
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', // <-- modelo activo
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error Anthropic:', response.status, data);
      return res.status(response.status).json({
        error: 'Error al conectar con la IA',
        detail: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error server:', error);
    return res.status(500).json({ error: 'Error al conectar con la IA' });
  }
}
