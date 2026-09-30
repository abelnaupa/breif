// api/generate.js (Se ejecuta en los servidores de Vercel)
export default async function handler(req, res) {
  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { url, stage, noLanding } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Se lee desde las variables de entorno de Vercel

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key no configurada en el servidor' });
  }

  try {
    const prompt = `Analiza la marca ${url} para una campaña de etapa ${stage}. Indica si no tiene landing page: ${noLanding}. Genera un brief estratégico con FODA, Target, Objetivos y Funnel.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error procesando la solicitud' });
  }
}
