import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || ''; // Ensure this is available

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const enhanceImage = async (
  imageFile: File, 
  backgroundOption: string, 
  customColor?: string,
  userDescription?: string // New parameter
): Promise<{ text: string; enhancedImageBase64?: string }> => {
  if (!API_KEY) {
    console.warn("API Key missing, returning mock response");
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                text: "Melhoria aplicada com sucesso (Mock).",
            });
        }, 2000);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = ai.models;
    
    const base64Data = await fileToGenerativePart(imageFile);
    
    // Prompt focado em "Fotografia Publicitária" e Integração de Cena
    let prompt = `
      Atue como um Fotógrafo Publicitário de Classe Mundial e Editor de Imagem Sênior.
      Sua missão é transformar esta foto amadora em uma IMAGEM COMERCIAL DE ALTA PERFORMANCE.

      DIRETRIZES GERAIS:
      1. TRATAMENTO DO OBJETO PRINCIPAL: Melhore a estética, corrija imperfeições, pele e materiais. Use iluminação de estúdio ("Rim Light"). Aumente a nitidez.
      2. O FUNDO: Use Profundidade de Campo (Bokeh f/1.8). Elementos sutis e neutros.
      3. INTEGRAÇÃO: Crie sombras de contato realistas. A temperatura de cor deve bater.
    `;

    // Inserção da descrição do usuário
    if (userDescription && userDescription.trim() !== "") {
        prompt += `
        
        IMPORTANTE - SOLICITAÇÃO ESPECÍFICA DO CLIENTE:
        O usuário solicitou explicitamente a seguinte modificação: "${userDescription}".
        
        INSTRUÇÃO CRÍTICA: Você DEVE realizar esta modificação integrando-a de forma FOTOREALISTA na cena. 
        Se o usuário pediu para adicionar um objeto, ele deve ter sombras, reflexos e iluminação condizentes com a foto.
        Se pediu para mudar o ambiente, mude todo o contexto de iluminação.
        `;
    }

    // Lógica de Background Específica
    if (backgroundOption === 'white') {
        prompt += `\nCENÁRIO: Estúdio de "Fundo Infinito" Branco Suave. Crie sombras suaves no chão.`;
    } else if (backgroundOption === 'dark') {
        prompt += `\nCENÁRIO: Estúdio Dark/Moody luxuoso. Fundo escuro sofisticado.`;
    } else if (backgroundOption === 'custom' && customColor) {
        prompt += `\nCENÁRIO: Estúdio monocromático profissional usando a cor ${customColor}.`;
    } else {
        prompt += `\nCENÁRIO: Mantenha o contexto original, mas melhore a composição e aplique desfoque (Blur) no fundo para destacar o sujeito.`;
    }

    const response = await model.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: imageFile.type,
                    data: base64Data
                }
            },
            { text: prompt }
        ]
      }
    });

    let enhancedImageBase64 = undefined;
    let description = "Imagem transformada com qualidade de estúdio profissional.";

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                enhancedImageBase64 = part.inlineData.data;
            } else if (part.text) {
                description = part.text;
            }
        }
    }

    return {
        text: description,
        enhancedImageBase64
    };

  } catch (error) {
    console.error("Error enhancing image:", error);
    throw error;
  }
};

export const generateImageFromText = async (
    userPrompt: string
  ): Promise<{ text: string; enhancedImageBase64?: string }> => {
    if (!API_KEY) {
      console.warn("API Key missing");
      return new Promise((resolve) => setTimeout(() => resolve({ text: "Mock generation" }), 2000));
    }
  
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const model = ai.models;
  
      // Prompt altamente otimizado para realismo
      const fullPrompt = `
        Gere uma FOTOGRAFIA HIPER-REALISTA baseada na seguinte descrição: "${userPrompt}".
        
        ESTILO E TÉCNICA:
        - Estilo: Fotografia Cinematográfica / Editorial de Revista.
        - Câmera: Sony A7R IV, lente 85mm f/1.4 GM.
        - Iluminação: Iluminação natural suave ("Golden Hour") ou iluminação de estúdio dramática, dependendo do contexto da descrição.
        - Detalhes: Textura de pele ultra-realista (se houver humanos), reflexos físicos corretos, micro-contrastes detalhados.
        - Qualidade: 8k, alta resolução, raw, sem artefatos de IA, sem aspecto de desenho ou pintura.
        
        A imagem deve ser indistinguível de uma foto real.
      `;
  
      const response = await model.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: fullPrompt }]
        }
      });
  
      let generatedImageBase64 = undefined;
      let text = "Imagem gerada com sucesso.";
  
      if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  generatedImageBase64 = part.inlineData.data;
              } else if (part.text) {
                  text = part.text;
              }
          }
      }
  
      return {
          text,
          enhancedImageBase64: generatedImageBase64
      };
  
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  };