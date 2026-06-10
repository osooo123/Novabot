import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) 
  : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    if (!anthropic) {
      return res.status(500).json({ text: "Error de configuración en el servidor." });
    }

    const { message, history } = req.body;

    const systemPrompt = `
      Eres "NOVA", la experta asesora de ventas para "Luisa Fernanda Boutique".
      Tu tono es magnético, empático y profesional. Usa emojis (👗, ✨, 🛍️).
      
      [CATÁLOGO]
      - Jeans Push Up Premium: $110.000 (Tallas 6-14).
      - Vestidos Casuales: $85.000 (Tallas S, M, L).
      - Blusas Crop Top: $45.000 (Talla única).

      [REGLAS]
      1. Envío GRATIS en Bogotá por compras > $150.000.
      2. Si el cliente quiere comprar, pide Nombre, Dirección/Barrio y método de pago.
      3. Sé breve y concisa.
    `;

    let messagesForAPI = [];
    if (history) {
      messagesForAPI = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: String(msg.text)
      }));
    }
    messagesForAPI.push({ role: 'user', content: String(message) });

    // LLAMADA FINAL: Este modelo es el que sí o sí debe funcionar con tu recarga
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messagesForAPI,
    });

    return res.status(200).json({ text: response.content[0].text });

  } catch (error) {
    console.error("Error crítico:", error);
    return res.status(200).json({ text: "¡Hola! Estoy ajustando unos detalles. ¿Me escribes en un momento? ✨" });
  }
}