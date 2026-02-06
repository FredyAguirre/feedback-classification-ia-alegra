const MODEL = 'gemini-2.5-flash';

/**
 * Función que se ejecuta automáticamente al enviar el formulario.
 * 
 * - Recibe los datos del evento onFormSubmit.
 * - Inserta la información en la hoja base.
 * - Dispara el procesamiento de la última fila con IA.
 */
function onFormSubmit(e) {
  if (!e || !e.values) {
    console.error('Evento inválido o sin datos:', e);
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaBase = ss.getSheetByName('Hoja 1');

  /**
   * Orden típico de respuestas de Google Forms:
   * [0] Marca temporal
   * [1] Correo electrónico
   * [2] Nombre del usuario
   * [3] Producto
   * [4] Comentario
   */
  const values = e.values;

  const marcaTiempo = values[0];
  const nombre = values[2];
  const producto = values[3];
  const comentario = values[4];

  // Inserta la fila base en la hoja principal
  hojaBase.appendRow([
    marcaTiempo,  // Columna A: Fecha
    producto,     // Columna B: Producto
    comentario,   // Columna C: Comentario
    nombre,       // Columna D: Nombre del usuario
    '',           // Columna E: Categoría de sentimiento (IA)
    ''            // Columna F: Resumen generado por IA
  ]);

  // Procesa únicamente la última fila insertada
  procesarUltimaFila();
}

/**
 * Procesa únicamente la última fila de la hoja base.
 * 
 * - Evita reprocesar filas antiguas.
 * - Solo ejecuta la IA si el comentario existe
 *   y la categoría de sentimiento está vacía.
 */
function procesarUltimaFila() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Hoja 1');
  const lastRow = sheet.getLastRow();

  // No procesar si solo existe la fila de encabezados
  if (lastRow < 2) return;

  const producto = sheet.getRange(lastRow, 2).getValue();   // Columna B
  const comentario = sheet.getRange(lastRow, 3).getValue(); // Columna C
  const sentimientoActual = sheet.getRange(lastRow, 5).getValue(); // Columna E

  // Evita procesar filas sin comentario o ya procesadas
  if (!comentario || sentimientoActual) return;

  const aiResult = clasificarConIA(producto, comentario);

  // Guarda resultados generados por la IA
  sheet.getRange(lastRow, 5).setValue(aiResult.sentiment);
  sheet.getRange(lastRow, 6).setValue(aiResult.summary);
}

/**
 * Clasifica el sentimiento de un comentario utilizando la API de Gemini.
 * 
 * @param {string} producto - Nombre del producto evaluado
 * @param {string} comentario - Comentario del usuario
 * @returns {Object} Objeto con:
 *  - sentiment: Positivo | Negativo | Neutro
 *  - summary: Resumen breve del comentario
 */
function clasificarConIA(producto, comentario) {
  const apiKey = PropertiesService
    .getScriptProperties()
    .getProperty('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('API Key de Gemini no configurada en las propiedades del script.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const prompt = `
Devuelve exclusivamente un JSON válido con el siguiente formato:

{
  "sentiment": "Positivo" | "Negativo" | "Neutro",
  "summary": "Resumen breve (máximo 20 palabras)"
}

Producto: ${producto}
Comentario: ${comentario}
`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-goog-api-key': apiKey
    },
    payload: JSON.stringify(payload)
  });

  const rawResponse = JSON.parse(response.getContentText());
  const cleanText = rawResponse.candidates[0].content.parts[0].text
    .replace(/```json|```/g, '')
    .trim();

  return JSON.parse(cleanText);
}
