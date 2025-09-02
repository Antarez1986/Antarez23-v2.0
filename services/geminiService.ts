
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, GeneratedContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Esquema para la respuesta JSON del modelo de texto
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                text: { type: Type.STRING, description: "El texto narrativo completo. Usa markdown para formato: **negrita**, *cursiva*, _subrayado_. Incluye exactamente 3 placeholders en el texto donde las viñetas visuales deberían ir: [VIGNETTE_1], [VIGNETTE_2], y [VIGNETTE_3]." },
                imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactamente 3 prompts descriptivos, uno para cada viñeta ([VIGNETTE_1], etc.), basados en la acción de esa parte de la historia." }
            },
        },
        workshop: {
            type: Type.OBJECT,
            properties: {
                saberQuestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            context: { type: Type.STRING, description: "Un párrafo introductorio de mínimo 100 caracteres." },
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactamente 4 opciones de respuesta." },
                            correctAnswer: { type: Type.STRING, description: "El texto exacto de la respuesta correcta de las opciones." },
                        },
                    },
                },
                matchingExercise: {
                    type: Type.OBJECT,
                    properties: {
                        columnA: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactamente 4 conceptos/eventos clave del texto." },
                        columnB: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactamente 5 descripciones/datos (1 es un distractor), desordenados." },
                    }
                },
                openQuestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Genera exactamente 2 preguntas abiertas para reflexión."
                },
                creativeActivity: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                    }
                },
                conceptMapFacts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Proporciona exactamente 5 hechos reales y verificables de la historia, en orden aleatorio."
                },
                extraActivities: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {type: Type.STRING, description: "El título de la actividad extra solicitada."},
                            content: {type: Type.STRING, description: "El contenido de la actividad en formato markdown."}
                        }
                    }
                }
            },
        },
    },
};

// Construye el prompt principal
const buildPrompt = (data: FormData): string => {
    return `
    Eres un experto escritor creativo y pedagogo. Tu tarea es generar un texto narrativo, prompts para imágenes, y un taller educativo completo basado en los datos del estudiante.

    Datos del Estudiante:
    - Nombre: ${data.studentName}
    - Grado Escolar: ${data.grade}
    - Tema Escolar: ${data.topic}
    - Tipo de Texto: ${data.textType}
    - Nivel de Dificultad: ${data.difficulty}
    - Detalles Adicionales: ${data.additionalDetails}
    - Preferencias Personales: ${data.preferences.join(', ')}
    - Longitud del Texto: Aproximadamente ${data.characterCount} caracteres

    Debes seguir TODAS las siguientes reglas rigurosamente:

    REGLAS PARA EL TEXTO NARRATIVO:
    1.  **Imágenes Integradas**:
        - En el cuerpo del texto, inserta exactamente tres placeholders: **[VIGNETTE_1]**, **[VIGNETTE_2]**, y **[VIGNETTE_3]** en momentos clave de la historia.
        - En el JSON de respuesta, bajo 'narrative.imagePrompts', provee 3 prompts de texto correspondientes a cada placeholder. Estos prompts serán usados para generar imágenes.
    2.  **Extensión y Formato**: El texto debe tener alrededor de ${data.characterCount} caracteres. Usa markdown.
    3.  **Título y Personaje**: Crea un título creativo e incluye a '${data.studentName}' como personaje.
    4.  **Tema y Aprendizaje**: El tema '${data.topic}' debe ser central. Incluye datos verificables.
    5.  **Adaptación de Lenguaje**: Ajusta la complejidad al nivel '${data.difficulty}'.
    6.  **Personalización**: Integra las preferencias (${data.preferences.join(', ')}) en la trama.

    REGLAS PARA EL TALLER:
    1.  **Preguntas tipo SABER**: Genera exactamente **${data.saberQuestionCount}** preguntas. Cada una con su contexto, 4 opciones de respuesta (opción múltiple, única respuesta).
    2.  **Unir Columnas**: Columna A con 4 conceptos, Columna B con 5 descripciones (1 distractor, desordenadas).
    3.  **Preguntas Abiertas**: Exactamente 2 preguntas de reflexión.
    4.  **Actividad Creativa**: 1 actividad para que el estudiante cree algo nuevo.
    5.  **Mapa Conceptual**: Proporciona 5 hechos reales (desordenados) de la historia.
    6.  **Actividades Extras**: Si se solicita, genera el contenido para las siguientes actividades: ${data.extraActivities.join(', ') || 'Ninguna'}. Cada una debe tener un título y contenido en markdown.

    Tu respuesta DEBE ser únicamente un objeto JSON válido que se ajuste al esquema proporcionado. No incluyas texto, explicaciones o \`\`\`json\`\`\` en tu respuesta.
    `;
};

// Función para generar una única imagen para colorear
const generateSingleColoringImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Página para colorear en blanco y negro, arte lineal simple, contornos gruesos, sin sombreado. Escena: ${prompt}`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '4:3',
        },
    });
    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error(`No se pudo generar una imagen para el prompt: "${prompt}"`);
};

export const generateStoryAndWorkshop = async (formData: FormData): Promise<GeneratedContent> => {
    try {
        // 1. Generar el contenido de texto y los prompts para las imágenes
        const textPrompt = buildPrompt(formData);
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = textResponse.text.trim();
        const parsedContent = JSON.parse(jsonText);

        const { narrative, workshop } = parsedContent;

        // 2. Preparar todos los prompts para la generación de imágenes en paralelo
        const coverPrompt = `Portada del cuento titulado "${narrative.title}" con el personaje principal, ${formData.studentName}, relacionado al tema de ${formData.topic}.`;
        const allImagePrompts = [coverPrompt, ...narrative.imagePrompts];

        if (allImagePrompts.length !== 4) {
             console.warn("Se esperaban 4 prompts de imagen (1 portada + 3 viñetas) pero se recibieron " + allImagePrompts.length);
        }

        // 3. Generar todas las imágenes en paralelo
        const imageGenerationPromises = allImagePrompts.map(p => generateSingleColoringImage(p));
        const imagesBase64 = await Promise.all(imageGenerationPromises);

        const [coverImage, ...vignetteImages] = imagesBase64;

        // 4. Ensamblar el resultado final
        const finalContent: GeneratedContent = {
            narrative: {
                ...narrative,
                coverImage,
                vignetteImages,
            },
            workshop,
        };
        
        return finalContent;

    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("No se pudo generar el contenido. Revisa la consola para más detalles.");
    }
};
