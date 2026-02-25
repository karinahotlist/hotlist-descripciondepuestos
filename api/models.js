// /api/models.js

export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error llamando a /v1/models:', response.status, data);
      return res.status(response.status).json(data);
    }

    // Te devolvemos en crudo la lista de modelos
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error llamando a /v1/models:', error);
    return res.status(500).json({ error: 'Error llamando a /v1/models' });
  }
}
