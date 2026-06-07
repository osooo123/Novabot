// pages/api/chat.js
// Este archivo protege tu API Key - nunca se ve desde el navegador

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
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // <--- ¡Modelo oficial corregido!
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();

    // Si Anthropic devuelve un error interno
    if (data.error) {
      console.error('Error de Anthropic:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // Extrae el texto limpio que envió Claude
    const reply = data.content && data.content[0] ? data.content[0].text : '';

    // Devuelve la respuesta estructurada al navegador
    return res.status(200).json({ text: reply });

  } catch (error) {
    console.error('Error API:', error);
    return res.status(500).json({ error: 'Error del servidor. Intenta de nuevo.' });
  }
}