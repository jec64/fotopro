import React, { useState, useRef } from 'react';
import { BackgroundOption } from '../types';
import { enhanceImage } from '../services/geminiService';

interface ImageEditorProps {
  onProcessComplete: (originalUrl: string, enhancedUrl: string, description: string) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onProcessComplete, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [background, setBackground] = useState<BackgroundOption>(BackgroundOption.Original);
  const [customColor, setCustomColor] = useState('#ff0000');
  const [userDescription, setUserDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
        const result = await enhanceImage(selectedFile, background, customColor, userDescription);
        
        let finalEnhancedUrl = previewUrl || '';
        // If API returned an image base64, use it. Otherwise use original (mock fallback)
        if (result.enhancedImageBase64) {
             finalEnhancedUrl = `data:image/png;base64,${result.enhancedImageBase64}`;
        }

        onProcessComplete(previewUrl!, finalEnhancedUrl, result.text);
    } catch (err) {
        alert('Erro ao processar imagem. Tente novamente.');
        console.error(err);
    } finally {
        setIsProcessing(false);
    }
  };

  if (!selectedFile) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6 animate-fade-in">
            <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6">
                 <h2 className="text-2xl font-bold">Nova Foto</h2>
                 <p className="text-center text-slate-500">Escolha uma imagem da galeria ou tire uma foto.</p>
                 
                 <div className="grid grid-cols-2 gap-4 w-full">
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-primary/20 transition-colors border-2 border-dashed border-slate-300 dark:border-slate-700"
                     >
                        <span className="material-symbols-outlined text-4xl mb-2 text-primary">add_photo_alternate</span>
                        <span className="font-semibold text-sm">Galeria</span>
                     </button>
                     <button 
                         onClick={() => fileInputRef.current?.click()} // Simulating camera via file input for web
                         className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-primary/20 transition-colors border-2 border-dashed border-slate-300 dark:border-slate-700"
                     >
                        <span className="material-symbols-outlined text-4xl mb-2 text-primary">photo_camera</span>
                        <span className="font-semibold text-sm">Câmera</span>
                     </button>
                 </div>

                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
                
                <button onClick={onCancel} className="mt-4 text-slate-400 font-medium">Cancelar</button>
            </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col h-full overflow-hidden">
        <div className="flex-1 relative bg-black flex items-center justify-center">
            <img src={previewUrl!} alt="Preview" className="max-w-full max-h-full object-contain" />
            
            {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-50">
                    <span className="material-symbols-outlined text-5xl animate-spin text-primary mb-4">auto_fix_high</span>
                    <p className="text-lg font-bold">A IA está trabalhando...</p>
                    <p className="text-sm opacity-70">Aplicando suas alterações</p>
                </div>
            )}
        </div>

        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.2)] max-h-[50vh] overflow-y-auto">
            
            {/* Background Selector */}
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-slate-500">Fundo</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-4">
                <button 
                    onClick={() => setBackground(BackgroundOption.Original)}
                    className={`flex flex-col items-center gap-2 min-w-[64px] ${background === BackgroundOption.Original ? 'opacity-100' : 'opacity-60'}`}
                >
                    <div className={`w-12 h-12 rounded-xl border-2 overflow-hidden ${background === BackgroundOption.Original ? 'border-primary' : 'border-transparent'}`}>
                        <img src={previewUrl!} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold">Original</span>
                </button>

                <button 
                    onClick={() => setBackground(BackgroundOption.White)}
                    className={`flex flex-col items-center gap-2 min-w-[64px] ${background === BackgroundOption.White ? 'opacity-100' : 'opacity-60'}`}
                >
                    <div className={`w-12 h-12 rounded-xl border-2 bg-white ${background === BackgroundOption.White ? 'border-primary' : 'border-slate-200'}`}></div>
                    <span className="text-[10px] font-bold">Branco</span>
                </button>

                <button 
                    onClick={() => setBackground(BackgroundOption.Dark)}
                    className={`flex flex-col items-center gap-2 min-w-[64px] ${background === BackgroundOption.Dark ? 'opacity-100' : 'opacity-60'}`}
                >
                    <div className={`w-12 h-12 rounded-xl border-2 bg-[#121212] ${background === BackgroundOption.Dark ? 'border-primary' : 'border-slate-700'}`}></div>
                    <span className="text-[10px] font-bold">Escuro</span>
                </button>

                 <div className="relative flex flex-col items-center gap-2 min-w-[64px]">
                    <div className={`w-12 h-12 rounded-xl border-2 bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center overflow-hidden ${background === BackgroundOption.Custom ? 'border-primary' : 'border-transparent'}`}>
                        <input 
                            type="color" 
                            className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
                            onChange={(e) => {
                                setBackground(BackgroundOption.Custom);
                                setCustomColor(e.target.value);
                            }}
                        />
                        <span className="material-symbols-outlined text-white text-lg">palette</span>
                    </div>
                     <span className="text-[10px] font-bold">Cor</span>
                 </div>
            </div>

            {/* User Prompt Input */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Edição com IA</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">Opcional</span>
                </div>
                <textarea
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="Ex: Adicione óculos de sol, mude o céu para pôr do sol, remova a pessoa no fundo..."
                    className="w-full bg-slate-100 dark:bg-black/20 border-0 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary resize-none h-20"
                />
            </div>

            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-bold bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white">Cancelar</button>
                <button onClick={handleProcess} className="flex-[2] py-3.5 rounded-xl font-bold bg-primary text-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">auto_fix_high</span>
                    Processar Foto
                </button>
            </div>
        </div>
    </div>
  );
};

export default ImageEditor;