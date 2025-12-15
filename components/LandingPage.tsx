import React, { useState } from 'react';
import { TermsContent } from './TermsContent';
import { supabase } from '../services/supabaseClient';

interface LandingPageProps {
  onLogin: (email: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return alert("Digite seu e-mail.");
    
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
        // DIRECT DATABASE LOOKUP (NO AUTH SERVICE)
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (error) {
             console.error(error);
             throw new Error("Erro ao conectar ao banco de dados.");
        }

        if (!user) {
            alert("Acesso negado. Este e-mail não foi encontrado na nossa base de convidados. Peça ao administrador para liberar seu acesso.");
            setLoading(false);
            return;
        }

        if (user.status === 'suspended') {
            alert("Esta conta está suspensa. Entre em contato com o suporte.");
            setLoading(false);
            return;
        }

        // Login Success
        onLogin(cleanEmail);

    } catch (error: any) {
        console.error(error);
        alert(error.message || "Erro ao tentar entrar.");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-display overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">camera_enhance</span>
            <span className="text-xl font-bold tracking-tight text-white">FOTOPRO</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-primary text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#45b822] transition-colors shadow-[0_0_15px_rgba(83,210,45,0.3)] flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-lg">login</span>
                Área do Cliente
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-40"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-bold text-primary tracking-wide uppercase">IA Generativa 2.5 Disponível</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 text-white">
            Transforme cliques em <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-300">vendas recorde</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Plataforma exclusiva para clientes convidados.
            Acesse seu painel para melhorar fotos e gerar imagens com IA.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button 
                onClick={() => setShowAuthModal(true)}
                className="w-full sm:w-auto h-16 px-10 rounded-full bg-primary text-black text-lg font-bold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(83,210,45,0.4)]"
            >
                Acessar Minha Conta
                <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black text-slate-500 text-sm mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="mb-4">&copy; 2025 FOTOPRO Todos os direitos reservados.</p>
            <div className="flex justify-center gap-6 text-xs">
                <button onClick={() => setShowTermsModal(true)} className="hover:text-white">Termos de Uso</button>
                <button onClick={() => setShowTermsModal(true)} className="hover:text-white">Privacidade</button>
            </div>
        </div>
      </footer>

      {/* LOGIN MODAL (JUST EMAIL) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)}></div>
            <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
                <button 
                    onClick={() => setShowAuthModal(false)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">account_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">Bem-vindo(a)</h2>
                    <p className="text-slate-400 text-sm">
                        Digite seu e-mail cadastrado para entrar.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 ml-1">E-mail de Acesso</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-lg"
                            placeholder="seu@email.com"
                            autoFocus
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-primary text-black font-bold py-4 rounded-xl mt-4 hover:bg-[#45b822] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Verificando...' : 'Entrar na Plataforma'}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* TERMS MODAL */}
      {showTermsModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowTermsModal(false)}></div>
              <div className="relative w-full max-w-2xl bg-[#151515] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
                  <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#151515] rounded-t-3xl">
                      <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                          <span className="material-symbols-outlined text-primary">gavel</span>
                          Termos & Políticas
                      </h2>
                      <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto custom-scrollbar">
                      <TermsContent />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};