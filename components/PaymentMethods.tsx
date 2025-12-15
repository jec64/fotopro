import React from 'react';

interface PaymentMethodsProps {
  onBack: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-40 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="flex items-center px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/10 mr-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Formas de Pagamento</h1>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {/* PIX */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm border border-transparent dark:border-white/5">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary">
                     <span className="material-symbols-outlined">qr_code_2</span>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Pix</h3>
                    <p className="text-xs text-slate-500">Aprovação imediata</p>
                </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                 <span className="material-symbols-outlined text-black text-[16px]">check</span>
            </div>
        </div>

        {/* Card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm opacity-70">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                     <span className="material-symbols-outlined">credit_card</span>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Cartão de Crédito</h3>
                    <p className="text-xs text-slate-500">Visa, Mastercard, Elo</p>
                </div>
            </div>
            <span className="px-2 py-1 rounded-md bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Em breve</span>
        </div>

        {/* Boleto */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm opacity-70">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                     <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Boleto Bancário</h3>
                    <p className="text-xs text-slate-500">Aprovação em até 3 dias</p>
                </div>
            </div>
             <span className="px-2 py-1 rounded-md bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Em breve</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;