// pages/api/chat.js
// ✅ Este archivo protege tu API Key — nunca se ve desde el navegador

export default async function handler(req, res) {
  // Solo acepta POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Lee el mensaje y el prompt del body
  const { messages, system } = req.body;

  // Verifica que llegaron los datos
  if (!messages || !system) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Llama a Anthropic usando tu API Key guardada en Vercel (segura)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,  // ← Segura en el servidor
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();

    // Si Anthropic devuelve error
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Devuelve la respuesta al navegador
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error API:', error);
    return res.status(500).json({ error: 'Error del servidor. Intenta de nuevo.' });
  }
}
