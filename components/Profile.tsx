import React, { useState } from 'react';
import { User, View } from '../types';

interface ProfileProps {
  user: User;
  onNavigate: (view: any) => void;
  onUpdateUser: (data: Partial<User>) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onNavigate, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);

  // Hardcoded admin email check
  const isAdmin = user.email === 'joao.fructuoso2021@gmail.com';

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateUser({ name: editName });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(user.name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in">
         <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 border-b border-black/5 dark:border-white/5 justify-between">
            <button onClick={handleCancel} className="text-slate-500 font-medium text-sm">Cancelar</button>
            <h2 className="text-lg font-bold">Editar Perfil</h2>
            <button onClick={handleSave} className="text-primary font-bold text-sm">Salvar</button>
         </div>

         <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col items-center">
                <div 
                    className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-surface-dark shadow-2xl opacity-60" 
                    style={{ backgroundImage: `url("${user.avatar}")` }}
                ></div>
                <p className="text-xs text-slate-500 mt-2">Alterar foto indisponível no momento</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Nome Completo</label>
                <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-surface-light dark:bg-surface-card-dark border-transparent focus:border-primary focus:ring-0 rounded-xl p-4 text-slate-900 dark:text-white font-medium"
                    placeholder="Seu nome"
                />
            </div>

            <div className="flex flex-col gap-2 opacity-50 pointer-events-none">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">E-mail</label>
                <input 
                    type="email" 
                    value={user.email}
                    readOnly
                    className="w-full bg-surface-light dark:bg-surface-card-dark border-transparent rounded-xl p-4 text-slate-500 dark:text-slate-400 font-medium"
                />
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-50 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-transparent dark:border-white/5">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12 pr-12">Perfil</h2>
      </div>

      <div className="flex p-4 flex-col items-center pt-8">
        <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-surface-dark shadow-2xl" 
            style={{ backgroundImage: `url("${user.avatar}")` }}
          ></div>
          <div className="absolute bottom-0 right-0 bg-surface-dark rounded-full p-1.5 border border-white/10 text-primary">
            <span className="material-symbols-outlined text-xl">edit</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-4 gap-1">
          <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{user.name}</p>
          <p className="text-gray-500 dark:text-[#a2c398] text-sm font-medium leading-normal text-center">Membro desde {user.joinDate}</p>
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* ADMIN BUTTON - ONLY VISIBLE TO JOAO */}
        {isAdmin && (
            <button 
                onClick={() => onNavigate(View.Admin)}
                className="w-full mb-6 py-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-900/40 transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
            >
                <span className="material-symbols-outlined">admin_panel_settings</span>
                ACESSAR PAINEL ADMIN
            </button>
        )}

        <h3 className="tracking-light text-xl font-bold leading-tight text-left pb-3 pl-1">Seu Plano</h3>
        <div className="w-full flex flex-col gap-4 rounded-xl border border-solid border-primary/20 bg-white dark:bg-surface-card-dark p-5 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-base font-bold leading-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">diamond</span>
                Avançado
              </h1>
              <p className="text-[#162013] text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary px-3 py-1 text-center">Ativo</p>
            </div>
            <div className="flex items-baseline gap-1 text-primary dark:text-white">
              <span className="text-3xl font-black leading-tight tracking-[-0.033em]">R$ 37,90</span>
              <span className="text-sm font-medium opacity-70">/mês</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Renovação automática</p>
          </div>
          <div className="w-full h-px bg-gray-200 dark:bg-white/10 my-1"></div>
          <div className="flex flex-col gap-2 z-10">
            <div className="text-[13px] font-medium leading-normal flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              Otimização de fotos ilimitada
            </div>
            <div className="text-[13px] font-medium leading-normal flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              Acesso a ferramentas de IA 2.5
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 mb-4">
        <a 
          className="w-full cursor-pointer flex items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary hover:bg-[#45b822] transition-colors text-[#111C10] gap-3 shadow-[0_0_20px_rgba(83,210,45,0.3)] no-underline group active:scale-[0.98] transform duration-150" 
          href="https://wa.me/5511950347959" 
          target="_blank"
          rel="noreferrer"
        >
          <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.71 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.36C16.32 14.23 15.11 13.64 14.88 13.55C14.66 13.47 14.49 13.42 14.33 13.67C14.16 13.92 13.69 14.47 13.55 14.64C13.4 14.8 13.26 14.82 13.01 14.7C12.76 14.57 11.96 14.31 11.01 13.47C10.27 12.81 9.77 12 9.62 11.75C9.48 11.5 9.61 11.36 9.74 11.24C9.85 11.13 9.99 10.95 10.11 10.81C10.24 10.67 10.28 10.57 10.36 10.4C10.45 10.23 10.4 10.09 10.34 9.96C10.28 9.84 9.8 8.65 9.6 8.17C9.4 7.69 9.21 7.76 9.07 7.76C8.94 7.76 8.78 7.75 8.63 7.75C8.47 7.75 8.22 7.81 8 8.05C7.78 8.29 7.17 8.86 7.17 10.03C7.17 11.2 8.02 12.33 8.14 12.49C8.26 12.65 9.83 15.07 12.23 16.11C12.8 16.36 13.25 16.51 13.6 16.62C14.18 16.8 14.72 16.78 15.15 16.71C15.63 16.64 16.63 16.11 16.84 15.52C17.05 14.93 17.05 14.43 16.99 14.33C16.92 14.24 16.76 14.19 16.57 14.36Z"></path>
          </svg>
          <span className="text-[17px] font-extrabold leading-normal tracking-wide">Falar com o Suporte</span>
        </a>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">Resposta média em menos de 5 minutos</p>
      </div>

      <div className="px-4 mt-6 flex flex-col gap-2 pb-32">
        <h3 className="tracking-light text-sm font-bold uppercase text-gray-500 dark:text-gray-400 pl-1 mb-1">Configurações</h3>
        
        {/* Edit Profile */}
        <button 
            onClick={() => {
                setEditName(user.name);
                setIsEditing(true);
            }}
            className="flex items-center w-full p-4 rounded-xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-white/5 active:scale-[0.99] transition-transform"
        >
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-900 dark:text-white mr-4">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="flex-1 text-left font-semibold text-sm">Editar Perfil</span>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
        </button>

        {/* Payment Methods */}
        <button 
            onClick={() => onNavigate(View.PaymentMethods)}
            className="flex items-center w-full p-4 rounded-xl bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-white/5 active:scale-[0.99] transition-transform"
        >
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-900 dark:text-white mr-4">
              <span className="material-symbols-outlined">credit_card</span>
            </div>
            <span className="flex-1 text-left font-semibold text-sm">Formas de Pagamento</span>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
        </button>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="flex items-center w-full p-4 mt-2 rounded-xl active:scale-[0.99] transition-transform"
        >
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-red-500 mr-4">
            <span className="material-symbols-outlined">logout</span>
          </div>
          <span className="flex-1 text-left font-semibold text-sm text-red-500">Sair da conta</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;