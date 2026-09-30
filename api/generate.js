// api/generate.js
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { brandUrl, stage, noLanding } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'Falta la API Key en Vercel.' });

    const systemPrompt = `
Eres un Director Estratégico de Marketing Digital. Analiza la marca/perfil: "${brandUrl}".
Etapa del Funnel: ${stage}.
¿Tiene sitio web activo?: ${noLanding ? 'NO cuenta con sitio web o landing page.' : 'SÍ cuenta con sitio web.'}

Genera un Brief Estratégico detallado:
1. Confirmación e Identidad de Marca (Qué hace exactamente).
2. Diagnóstico de Infraestructura Digital (Si no tiene landing, incluye especificaciones para crearla).
3. Análisis FODA.
4. Competencia & Ventaja Única (UVP).
5. Público Objetivo (Target).
6. Paleta de Colores (Códigos HEX) & Tono de Voz.
7. Objetivos, KPIs, Canales & Presupuesto.
8. Estrategia de Contenidos Inbound para la etapa ${stage}.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
    });

    const data = await response.json();
    return res.status(200).json({ result: data.candidates?.[0]?.content?.parts?.[0]?.text || '' });

  } catch (error) {
    return res.status(500).json({ error: 'Error del servidor: ' + error.message });
  }
};
