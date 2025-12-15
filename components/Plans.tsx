import React, { useState } from 'react';

const Plans: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  // Single Plan Configuration
  const plan = {
      id: 'advanced',
      name: 'Avançado',
      photos: 'Ilimitadas',
      price: { monthly: 37.90, yearly: 379.00 },
      features: [
          'Fotos Ilimitadas', 
          'Melhoria com IA 2.5', 
          'Gerador de Imagens Hiper-realista', 
          'Alta Prioridade de Processamento', 
          'Sem marca d\'água',
          'Acesso a API (Beta)', 
          'Gerente de Conta Dedicado'
      ],
      highlight: true
  };

  const handleSelectPlan = () => {
      const message = `Olá! Gostaria de assinar o plano *${plan.name}* (${billing === 'monthly' ? 'Mensal' : 'Anual'}) no valor de R$ ${plan.price[billing].toFixed(2).replace('.', ',')}. Poderia me enviar o Pix para pagamento e liberar meu acesso?`;
      const url = `https://wa.me/5511950347959?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-32">
       <header className="sticky top-0 z-40 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
        <div className="flex flex-col items-center justify-center px-5 py-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Assinatura Premium</h1>
          <p className="text-sm text-slate-500">Desbloqueie todo o potencial da IA</p>
        </div>
      </header>

      <div className="px-4 py-6 flex flex-col items-center">
        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="relative flex bg-slate-200 dark:bg-surface-dark p-1 rounded-full cursor-pointer">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white dark:bg-primary shadow-sm transition-all duration-300 ${billing === 'monthly' ? 'left-1' : 'left-[calc(50%+4px)]'}`}></div>
            <button 
                onClick={() => setBilling('monthly')}
                className={`relative z-10 px-6 py-2 text-sm font-bold transition-colors ${billing === 'monthly' ? 'text-black' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Mensal
            </button>
            <button 
                onClick={() => setBilling('yearly')}
                className={`relative z-10 px-6 py-2 text-sm font-bold transition-colors flex items-center gap-1 ${billing === 'yearly' ? 'text-black dark:text-black' : 'text-slate-500 dark:text-slate-400'}`}
            >
                Anual
                <span className="text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full ml-1">-17%</span>
            </button>
          </div>
        </div>

        {/* Single Plan Card */}
        <div className="w-full max-w-md relative overflow-hidden rounded-3xl p-8 transition-transform active:scale-[0.99] bg-surface-dark border border-primary shadow-[0_0_40px_rgba(83,210,45,0.2)]">
            <div className="absolute top-0 right-0 bg-primary text-[#111C10] text-xs font-bold px-4 py-1.5 rounded-bl-2xl">PLANO ÚNICO & COMPLETO</div>
            
            <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-4xl text-primary">diamond</span>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-extrabold text-white tracking-tight">
                    R$ {plan.price[billing].toFixed(2).replace('.', ',')}
                </span>
                <span className="text-base text-slate-400 font-medium">{billing === 'monthly' ? '/mês' : '/ano'}</span>
            </div>

            <div className="w-full h-px bg-white/10 mb-6"></div>

            <ul className="flex flex-col gap-4 mb-8">
                {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-base font-medium text-slate-300">
                        <span className="material-symbols-outlined text-primary text-[20px] bg-primary/10 p-1 rounded-full">check</span>
                        <span className="text-white">{feat}</span>
                    </li>
                ))}
            </ul>

            <button 
                onClick={handleSelectPlan}
                className="w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-primary text-[#111C10] hover:bg-[#45b822] shadow-lg shadow-primary/20"
            >
                <span>Assinar Agora via WhatsApp</span>
                <span className="material-symbols-outlined text-[20px]">chat</span>
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-4">
                Acesso liberado imediatamente após confirmação.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Plans;