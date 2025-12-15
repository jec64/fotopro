import React, { useState } from 'react';
import { User, Photo } from '../types';
import { generateImageFromText } from '../services/geminiService';

interface ImageGeneratorProps {
  user: User;
  onPhotoGenerated: (url: string, description: string) => void;
  onNavigatePlan: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ user, onPhotoGenerated, onNavigatePlan }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const canAccess = user.plan === 'Pro' || user.plan === 'Avançado';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
        const result = await generateImageFromText(prompt);
        if (result.enhancedImageBase64) {
            setGeneratedImage(`data:image/png;base64,${result.enhancedImageBase64}`);
        }
    } catch (e) {
        alert("Erro ao gerar imagem. Tente novamente.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSave = () => {
      if (generatedImage) {
          onPhotoGenerated(generatedImage, `Gerada por IA: ${prompt}`);
      }
  };

  if (!canAccess) {
      return (
          <div className="flex flex-col h-full bg-background-light dark:bg-background-dark p-6 items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-surface-dark flex items-center justify-center mb-6 shadow-xl shadow-primary/10 border border-white/5">
                  <span className="material-symbols-outlined text-4xl text-primary">lock</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Recurso Premium</h2>
              <p className="text-slate-500 mb-8 max-w-xs">A geração de fotos hiper-realistas com IA está disponível apenas para membros Pro e Avançado.</p>
              
              <button 
                onClick={onNavigatePlan}
                className="w-full max-w-xs py-4 rounded-xl bg-primary text-black font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                  Fazer Upgrade Agora
              </button>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto pb-32">
       <header className="sticky top-0 z-40 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="flex items-center px-4 py-4">
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            Gerar Foto Realista
          </h1>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-6">
          {!generatedImage ? (
              <>
                <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-transparent dark:border-white/5 shadow-sm">
                    <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-200">
                        Descreva a imagem que você imagina
                    </label>
                    <textarea 
                        className="w-full h-32 bg-slate-100 dark:bg-black/20 border-0 rounded-xl p-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary resize-none mb-2"
                        placeholder="Ex: Um retrato profissional de um advogado em um escritório moderno, iluminação suave, fundo desfocado..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-slate-400 text-right">{prompt.length}/500</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-transparent dark:border-white/5 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setPrompt('Um café da manhã saudável com frutas e suco em uma mesa de madeira rústica, luz da manhã.')}>
                        <span className="text-xs font-medium text-slate-500">Comida</span>
                        <p className="text-xs font-bold mt-1 line-clamp-2">Café da manhã rústico, luz natural...</p>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-transparent dark:border-white/5 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setPrompt('Retrato de uma mulher jovem sorrindo, cabelo cacheado, luz de estúdio, fundo neutro.')}>
                        <span className="text-xs font-medium text-slate-500">Retrato</span>
                        <p className="text-xs font-bold mt-1 line-clamp-2">Mulher sorrindo, luz de estúdio...</p>
                    </div>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className={`w-full py-4 rounded-xl font-bold text-black shadow-lg flex items-center justify-center gap-2 mt-4 transition-all ${!prompt.trim() || isGenerating ? 'bg-slate-300 dark:bg-white/10 text-slate-500' : 'bg-primary shadow-primary/20 active:scale-95'}`}
                >
                    {isGenerating ? (
                        <>
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            Gerando...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">shutter_speed</span>
                            Gerar Foto
                        </>
                    )}
                </button>
              </>
          ) : (
              <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                      <img src={generatedImage} alt="Gerada por IA" className="w-full h-auto" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                         <button onClick={() => setGeneratedImage(null)} className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                             <span className="material-symbols-outlined">refresh</span>
                         </button>
                      </div>
                  </div>
                  
                  <div className="flex gap-3">
                      <button onClick={() => setGeneratedImage(null)} className="flex-1 py-3.5 rounded-xl font-bold bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white">Descartar</button>
                      <button onClick={handleSave} className="flex-[2] py-3.5 rounded-xl font-bold bg-primary text-black shadow-lg shadow-primary/20">
                          Salvar na Galeria
                      </button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default ImageGenerator;