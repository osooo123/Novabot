// Importación ultra-compatible para entornos estrictos
import Anthropic from '@anthropic-ai/sdk';

// Inicialización con validación previa para evitar fallos en el build si la clave no se ha leído
const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) 
  : null;

export default async function handler(req, res) {
  // Validar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Si la API key no está configurada, disparamos el fallback de inmediato
    if (!anthropic) {
      console.error("Falta la variable ANTHROPIC_API_KEY en el entorno.");
      return res.status(200).json({ 
        text: "¡Hola! 😍 Veo que estás interesada en nuestra hermosa colección. Presiona los botones de abajo para mostrarte los precios, tallas y las prendas espectaculares que tenemos listas para envío inmediato hoy mismo. ✨" 
      });
    }

    const { message, history } = req.body;

    // System prompt comercial avanzado para NOVA
    const systemPrompt = `
      Eres "NOVA", la experta asesora de ventas de Inteligencia Artificial para "Luisa Fernanda Boutique".
      Tu objetivo principal es atender las solicitudes de los clientes de forma magnética, empática, ágil y cerrar ventas.

      [REGLAS DE TONO]
      - Tu tono es cercano, persuasivo y utiliza emojis (👗, ✨, 🛍️, 🔥).
      - Respuestas concisas y fáciles de leer en celulares (máximo 2 o 3 párrafos cortos).
      - NUNCA inventes productos que no estén en el catálogo.

      [CATÁLOGO OFICIAL]
      • 👖 Jeans Push Up Premium ($110.000 COP): Horma perfecta, tiro alto. (Tallas 6 a 14).
      • 👗 Vestidos Casuales ($85.000 COP): Confeccionados en lino de alta calidad. (Tallas S, M, L).
      • 👚 Blusas Crop Top ($45.000 COP): En rib elástico (Talla única).

      [PROCESO DE CIERRE]
      1. ASESORÍA: Responde dudas de precios o materiales.
      2. INCENTIVO: Envío GRATIS en Bogotá por compras superiores a $150.000.
      3. TOMA DE PEDIDO: Solicita uno a uno: Nombre, Dirección/Barrio y Método de pago (Nequi, Daviplata o Contraentrega).
      4. RESUMEN: Muestra el desglose final con el valor total exacto.
    `;

    // Procesamiento y mapeo del historial de mensajes
    let messagesForAPI = [];
    if (history && Array.isArray(history) && history.length > 0) {
      messagesForAPI = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: String(msg.text || '')
      }));
    }

    if (message) {
      messagesForAPI.push({ role: 'user', content: String(message) });
    }

    if (messagesForAPI.length === 0) {
      messagesForAPI.push({ role: 'user', content: 'Hola' });
    }

    // LLAMADA CORREGIDA: Se usa claude-2.1 para saltar la restricción del tier gratuito
    const response = await anthropic.messages.create({
      model: "claude-2.1", 
      max_tokens: 1000,
      temperature: 0.5,
      system: systemPrompt,
      messages: messagesForAPI,
    });

    const botReply = response.content[0].text;
    return res.status(200).json({ text: botReply });

  } catch (error) {
    console.error("Error en backend chat.js:", error);
    // Respuesta segura anti-caídas corta para mantener el flujo limpio
    return res.status(200).json({ 
      text: "Disculpa, tuve un pequeño problema al procesar el mensaje. ¿Podrías intentar enviarlo de nuevo? ✨" 
    });
  }
}