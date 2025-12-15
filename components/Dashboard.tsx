import React from 'react';
import { User, Photo } from '../types';

interface DashboardProps {
  user: User;
  recentPhotos: Photo[];
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, recentPhotos, onNavigate }) => {
  return (
    <>
      <header className="flex items-center justify-between p-6 pt-12 pb-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Bem-vindo(a) de volta,</span>
          <h1 className="text-2xl font-bold leading-tight tracking-tight">{user.name}</h1>
        </div>
        <div 
            className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-surface-dark overflow-hidden cursor-pointer"
            onClick={() => onNavigate('profile')}
        >
          <img 
            alt="Perfil do Usuário" 
            className="h-full w-full object-cover" 
            src={user.avatar} 
          />
        </div>
      </header>

      <main className="flex flex-col gap-6 px-4 pb-24">
        {/* Stats Card */}
        <div className="relative flex w-full flex-col gap-3 rounded-2xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm dark:shadow-none overflow-hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>auto_fix_high</span>
              <p className="text-slate-500 dark:text-slate-300 text-base font-medium">Total de Melhorias</p>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <p className="text-primary tracking-tight text-5xl font-extrabold leading-tight">{user.totalEnhanced.toLocaleString()}</p>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+{user.monthlyGrowth}%</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-1">Fotos processadas este mês</p>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate('editor')} className="flex flex-col items-center gap-2 group p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition-all">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-black shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">add_a_photo</span>
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Nova Foto</span>
          </button>
          
          <button onClick={() => onNavigate('photos')} className="flex flex-col items-center gap-2 group p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 transition-all">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white">
              <span className="material-symbols-outlined">history</span>
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Histórico</span>
          </button>
        </div>

        {/* Plan Card */}
        <div className="flex flex-col gap-4 rounded-2xl bg-surface-light dark:bg-surface-dark p-6 shadow-sm dark:shadow-none border border-transparent dark:border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold leading-tight">Plano Atual</h3>
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/80 to-primary px-3 py-1 text-xs font-bold text-black shadow-[0_0_10px_rgba(83,210,45,0.3)]">
              {user.plan.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-500 dark:text-slate-400">Créditos Usados</span>
              <span className="text-slate-900 dark:text-white">{user.credits}<span className="text-slate-400 text-xs font-normal"> / {user.maxCredits}</span></span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-black/40">
              <div 
                className="h-full rounded-full bg-primary" 
                style={{ width: `${(user.credits / user.maxCredits) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">Renova em 24 de Out, 2023</p>
          </div>
          <div className="pt-2">
            <button 
              onClick={() => onNavigate('plan')}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-6 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-slate-200 dark:hover:bg-white/20"
            >
              Gerenciar Assinatura
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">Atividade Recente</h3>
            <button onClick={() => onNavigate('photos')} className="text-sm font-bold text-primary">Ver Tudo</button>
          </div>
          <div className="flex w-full gap-4 overflow-x-auto no-scrollbar pb-2">
            {recentPhotos.map((photo) => (
              <div key={photo.id} className="relative flex flex-col gap-2 min-w-[140px] cursor-pointer" onClick={() => onNavigate('photos')}>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-800">
                  <img 
                    className={`h-full w-full object-cover ${photo.status === 'processing' ? 'opacity-60 grayscale' : 'opacity-80'}`} 
                    src={photo.enhancedUrl || photo.originalUrl} 
                    alt={photo.name} 
                  />
                  {photo.status === 'completed' ? (
                    <div className="absolute right-2 top-2 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-primary border border-white/10">
                      Pronto
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="truncate text-sm font-bold">{photo.name}</span>
                  <span className="text-xs text-slate-500">{photo.status === 'processing' ? 'Processando...' : photo.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;