# Clasificador de Feedback con IA – Alegra

## Tabla de Contenido
- [Clasificador de Feedback con IA – Alegra](#clasificador-de-feedback-con-ia--alegra)
  - [Tabla de Contenido](#tabla-de-contenido)
  - [Descripción](#descripción)
  - [Arquitectura de la solución](#arquitectura-de-la-solución)
  - [Tecnologías utilizadas](#tecnologías-utilizadas)
  - [Configuración](#configuración)
  - [Uso](#uso)
  - [Dashboard de análisis](#dashboard-de-análisis)
  - [Recursos del proyecto](#recursos-del-proyecto)
  - [Consideraciones técnicas](#consideraciones-técnicas)

---

## Descripción

Este proyecto implementa un sistema automatizado para la recolección, clasificación y análisis de feedback de clientes utilizando Google Forms, Google Sheets, Apps Script y la API de Gemini.

Cuando un usuario envía un formulario, el sistema:
1. Almacena la información en una hoja de cálculo.
2. Clasifica automáticamente el sentimiento del comentario (Positivo, Negativo o Neutro).
3. Genera un resumen breve del feedback usando IA.
4. Actualiza un dashboard interactivo para el análisis de resultados.

---

## Arquitectura de la solución

La solución está compuesta por los siguientes componentes:

- **Google Forms**: Captura del feedback del usuario.
- **Google Sheets**: Almacenamiento de datos y resultados del procesamiento.
- **Google Apps Script**: Automatización del flujo y conexión con la API de IA.
- **Gemini API**: Clasificación de sentimiento y generación de resumen.
- **Looker Studio**: Visualización de métricas y análisis de feedback.

---

## Tecnologías utilizadas

- Google Apps Script (JavaScript)
- Google Forms
- Google Sheets
- Google Looker Studio
- Gemini API (modelo `gemini-2.5-flash`)
- Markdown (documentación)

---

## Configuración

1. Crear un Google Form con los campos:
   - Nombre del usuario
   - Producto
   - Comentario

2. Vincular el formulario a una hoja de cálculo de Google Sheets.

3. Abrir el editor de Apps Script desde la hoja y pegar el contenido del archivo `Code.js`.

4. Configurar la variable de entorno:
   - Agregar la API Key de Gemini en **Propiedades del script** con el nombre:
     ```
     GEMINI_API_KEY
     ```

5. Verificar que el trigger `onFormSubmit` esté activo.

---

## Uso

1. El usuario envía una respuesta desde el formulario.
2. La información se guarda automáticamente en Google Sheets.
3. El script procesa únicamente la última fila insertada.
4. Se clasifica el sentimiento y se genera un resumen del comentario.
5. Los resultados se reflejan en tiempo real en el dashboard.

---

## Dashboard de análisis

El proyecto incluye un dashboard interactivo en Looker Studio que permite:

- Visualizar el total de feedback recibido.
- Analizar la distribución de sentimientos.
- Filtrar por producto, categoría de sentimiento y rango de fechas.

🔗 **Dashboard**:  
https://lookerstudio.google.com/reporting/6abbd5f4-a8e6-42a9-b82d-d04bce0aa520

---
## Recursos del proyecto

Los siguientes recursos están disponibles en modo lectura para su revisión:

- 📄 **Google Sheets (Base de datos)**  
  https://docs.google.com/spreadsheets/d/17NmeKaG401K5P5bqiXxEu0DwgqhIqVGO7gwf4bPByMs/edit

- 📝 **Google Forms (Formulario de captura)**  
  https://docs.google.com/forms/d/e/1FAIpQLSecmJDXOXpLTL1pcbxoQnCSlROjcVcKb_xI9pz1tawMvye5GQ/viewform


## Consideraciones técnicas

- El sistema procesa solo nuevas respuestas para evitar reprocesamientos.
- La ejecución depende de la cuota disponible de la API de Gemini.
- Las credenciales sensibles no se incluyen en el repositorio por seguridad.
- Los accesos a los recursos se comparten en modo lectura para revisión.

