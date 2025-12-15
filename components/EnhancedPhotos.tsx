import React from 'react';
import { Photo } from '../types';
import BeforeAfterSlider from './BeforeAfterSlider';

interface EnhancedPhotosProps {
  photos: Photo[];
}

const EnhancedPhotos: React.FC<EnhancedPhotosProps> = ({ photos }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 transition-colors duration-300">
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Fotos Melhoradas</h1>
          <button className="flex items-center justify-center h-9 w-9 rounded-full bg-white dark:bg-surface-dark ring-1 ring-black/5 dark:ring-white/10 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6 px-4 pt-4 pb-32">
        {photos.map((photo) => (
          <article key={photo.id} className="group relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark shadow-card dark:shadow-card-dark transition-all duration-300">
            
            {/* Slider Component */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <BeforeAfterSlider 
                originalUrl={photo.originalUrl} 
                enhancedUrl={photo.enhancedUrl} 
                className="w-full h-full"
              />
            </div>

            <div className="p-5">
              <div className="mb-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{photo.name}</h3>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`material-symbols-outlined text-[16px] ${star <= (photo.rating || 0) ? 'text-yellow-500 fill-1' : 'text-slate-300'}`}>star</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
                  {photo.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-white/5 py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white transition-all active:scale-95 hover:bg-slate-200 dark:hover:bg-white/10">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Baixar
                </button>
                <button className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 p-3 text-slate-900 dark:text-white transition-all active:scale-95 hover:bg-slate-200 dark:hover:bg-white/10 aspect-square">
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default EnhancedPhotos;