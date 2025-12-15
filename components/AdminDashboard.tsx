import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface AdminDashboardProps {
  onBack: () => void;
  currentUserEmail: string;
}

type AdminTab = 'overview' | 'users' | 'plans' | 'moderation';

interface Plan {
    id: string;
    name: string;
    price: string;
    usersCount: number;
    maxCredits: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, currentUserEmail }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  
  // Single Plan Configuration for Admin
  const [plans, setPlans] = useState<Plan[]>([
      { id: 'Avançado', name: 'Avançado', price: 'R$ 37,90', usersCount: 0, maxCredits: 9999 },
  ]);
  
  // Modals
  const [showUserModal, setShowUserModal] = useState(false);

  // User Form
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  // Default to Avançado since it's the only plan
  const [newUserPlan, setNewUserPlan] = useState('Avançado');

  // Security Check (Frontend only - RLS must match)
  const isAdmin = currentUserEmail === 'joao.fructuoso2021@gmail.com';
  
  if (!isAdmin) {
      return (
          <div className="flex h-screen items-center justify-center bg-black text-red-500 font-bold flex-col gap-4">
              <span className="material-symbols-outlined text-6xl">gpp_bad</span>
              <h1 className="text-2xl">ACESSO NEGADO</h1>
              <p className="text-slate-400">Esta área é restrita.</p>
              <button onClick={onBack} className="text-white underline">Voltar</button>
          </div>
      );
  }

  useEffect(() => {
      fetchUsers();
  }, []);

  useEffect(() => {
      if (activeTab === 'moderation') {
          fetchPhotos();
      }
      if (activeTab === 'plans' && users.length > 0) {
          setPlans(prev => prev.map(p => ({
              ...p,
              usersCount: users.filter(u => u.plan === p.id).length
          })));
      }
  }, [activeTab, users]);

  const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*').order('join_date', { ascending: false });
      if (data) setUsers(data);
      if (error) console.error("Erro ao buscar usuários:", error.message);
  };

  const fetchPhotos = async () => {
    const { data, error } = await supabase
        .from('photos')
        .select(`*, users (name, email)`)
        .order('date', { ascending: false })
        .limit(50);
    if (data) setPhotos(data);
  };

  // --- ACTIONS ---

  const handleUpdatePlan = async (userId: string, newPlanName: string) => {
    if (!confirm(`Tem certeza que deseja mudar o plano deste usuário para ${newPlanName}?`)) return;
    
    setLoadingAction(true);
    try {
        const planDetails = plans.find(p => p.name === newPlanName) || plans[0];
        
        const { error } = await supabase.from('users').update({
            plan: newPlanName,
            max_credits: planDetails.maxCredits
        }).eq('id', userId);

        if (error) throw error;

        alert(`Plano alterado para ${newPlanName} com sucesso!`);
        fetchUsers(); // Refresh UI
    } catch (err: any) {
        console.error(err);
        alert(`Erro ao atualizar plano: ${err.message}`);
    } finally {
        setLoadingAction(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete' | 'reset_credits') => {
      if (!confirm(`Confirmar ação: ${action.toUpperCase()}?`)) return;
      setLoadingAction(true);
      try {
        let updateData = {};
        if (action === 'suspend') updateData = { status: 'suspended' };
        else if (action === 'activate') updateData = { status: 'active' };
        else if (action === 'reset_credits') updateData = { credits: 0, credits_used: 0 };
        else if (action === 'delete') {
            const { error } = await supabase.from('users').delete().eq('id', userId);
            if (error) throw error;
            alert("Usuário excluído.");
            await fetchUsers();
            setSelectedUserId(null);
            return;
        }

        const { error } = await supabase.from('users').update(updateData).eq('id', userId);
        if (error) throw error;
        
        alert(`Ação ${action} realizada com sucesso!`);
        await fetchUsers();
      } catch (err: any) {
          alert(`Erro: ${err.message}`);
      } finally {
          setLoadingAction(false);
      }
  };

  const handleDeletePhoto = async (photoId: string) => {
      if (confirm('Apagar foto do banco de dados?')) {
          await supabase.from('photos').delete().eq('id', photoId);
          fetchPhotos();
      }
  };

  const handleCreateUser = async () => {
      if (!newUserEmail || !newUserName) return alert("Preencha Nome e E-mail");
      
      setLoadingAction(true);
      try {
          // Check locally first to avoid DB call if possible
          const exists = users.find(u => u.email.toLowerCase() === newUserEmail.toLowerCase());
          if (exists) throw new Error("Já existe um usuário com este e-mail na lista.");

          const planDetails = plans[0]; // Always Avançado
          
          const newId = crypto.randomUUID();
          const cleanEmail = newUserEmail.toLowerCase().trim();

          // Tenta inserir
          const { data, error } = await supabase.from('users').insert({
              id: newId,
              name: newUserName,
              email: cleanEmail,
              plan: 'Avançado',
              max_credits: planDetails.maxCredits,
              credits: 0, 
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUserName)}&background=53d22d&color=000`,
              status: 'active',
              join_date: new Date().toISOString()
          }).select();

          if (error) {
              console.error("Supabase Insert Error:", error);
              throw new Error(error.message);
          }

          alert(`Usuário criado com sucesso!\nEmail: ${cleanEmail}\nO acesso já está liberado.`);
          setShowUserModal(false);
          setNewUserEmail('');
          setNewUserName('');
          fetchUsers();

      } catch (err: any) {
          console.error(err);
          alert(`Erro ao criar usuário: ${err.message}\n\nDica: Verifique se o e-mail já existe ou se as políticas (RLS) do Supabase permitem inserção.`);
      } finally {
          setLoadingAction(false);
      }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => 
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = users.find(u => u.id === selectedUserId);

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
    { id: 'users', label: 'Usuários', icon: 'people' },
    { id: 'plans', label: 'Planos', icon: 'payments' },
    { id: 'moderation', label: 'Moderação', icon: 'gavel' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white font-display overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#0A0A0A] flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="text-slate-400 hover:text-white"><span className="material-symbols-outlined">arrow_back</span></button>
                <h1 className="font-bold text-lg text-white">ADMINISTRADOR</h1>
            </div>
            <div className="text-sm font-bold text-primary">Logado como: {currentUserEmail}</div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col shrink-0">
                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id as AdminTab); setSelectedUserId(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-primary text-black font-bold' : 'text-slate-400 hover:bg-white/5'}`}>
                            <span className="material-symbols-outlined">{item.icon}</span>{item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto p-8 bg-[#050505]">
                
                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                                <p className="text-slate-500 text-xs font-bold uppercase">Total Usuários</p>
                                <h3 className="text-3xl font-bold mt-2">{users.length}</h3>
                            </div>
                            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                                <p className="text-slate-500 text-xs font-bold uppercase">Novos (Hoje)</p>
                                <h3 className="text-3xl font-bold mt-2 text-primary">
                                    {users.filter(u => new Date(u.join_date).toDateString() === new Date().toDateString()).length}
                                </h3>
                            </div>
                             <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                                <p className="text-slate-500 text-xs font-bold uppercase">Fotos Processadas</p>
                                <h3 className="text-3xl font-bold mt-2">
                                    {users.reduce((acc, curr) => acc + (curr.total_enhanced || 0), 0)}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: USERS */}
                {activeTab === 'users' && (
                    <div className="animate-fade-in">
                        {selectedUserId && selectedUser ? (
                            <div className="flex flex-col gap-6">
                                <button onClick={() => setSelectedUserId(null)} className="flex items-center gap-2 text-slate-400 hover:text-white w-fit">
                                    <span className="material-symbols-outlined">arrow_back</span> Voltar para lista
                                </button>
                                <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <img src={selectedUser.avatar} className="w-20 h-20 rounded-full border-2 border-primary" />
                                            <div>
                                                <h3 className="text-3xl font-bold">{selectedUser.name}</h3>
                                                <p className="text-slate-400">{selectedUser.email}</p>
                                                <p className="text-xs text-slate-500 mt-1">ID: {selectedUser.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="text-sm text-slate-500">Plano Atual</p>
                                            
                                            {/* PLAN SELECTOR DROPDOWN */}
                                            <div className="relative">
                                                <select 
                                                    value={selectedUser.plan}
                                                    onChange={(e) => handleUpdatePlan(selectedUser.id, e.target.value)}
                                                    disabled={loadingAction}
                                                    className="bg-primary/10 border border-primary/30 text-primary text-xl font-bold rounded-lg py-2 px-4 pr-8 appearance-none cursor-pointer hover:bg-primary/20 transition-colors focus:ring-2 focus:ring-primary outline-none"
                                                >
                                                    {plans.map(p => (
                                                        <option key={p.id} value={p.name} className="bg-[#222] text-white text-sm">
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">Mudar o plano atualiza os créditos máx.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-slate-500 uppercase">Créditos Usados</p>
                                            <p className="text-xl font-bold">{selectedUser.credits_used || selectedUser.credits || 0} / {selectedUser.max_credits}</p>
                                        </div>
                                        <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                            <p className="text-xs text-slate-500 uppercase">Status</p>
                                            <p className={`text-xl font-bold ${selectedUser.status === 'suspended' ? 'text-red-500' : 'text-green-500'}`}>
                                                {selectedUser.status === 'suspended' ? 'SUSPENSO' : 'ATIVO'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <h4 className="font-bold mb-4 border-b border-white/10 pb-2">Ações Administrativas</h4>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => handleUserAction(selectedUser.id, 'reset_credits')} className="px-5 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-sm font-bold border border-blue-500/20">
                                            Zerar Créditos
                                        </button>
                                        <button onClick={() => handleUserAction(selectedUser.id, selectedUser.status === 'active' ? 'suspend' : 'activate')} className={`px-5 py-3 rounded-xl text-sm font-bold border ${selectedUser.status === 'active' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'}`}>
                                            {selectedUser.status === 'active' ? 'Suspender Acesso' : 'Reativar Acesso'}
                                        </button>
                                        <button onClick={() => handleUserAction(selectedUser.id, 'delete')} className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-bold border border-red-500/20 ml-auto">
                                            Excluir Usuário
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <input type="text" placeholder="Buscar por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm w-full md:w-64 focus:ring-primary focus:border-primary" />
                                        <button onClick={() => setShowUserModal(true)} className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#45b822] flex items-center gap-2 whitespace-nowrap">
                                            <span className="material-symbols-outlined text-lg">add</span> Novo Usuário
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left whitespace-nowrap">
                                            <thead className="bg-white/5 text-slate-400 font-bold uppercase text-xs">
                                                <tr><th className="px-6 py-4">Usuário</th><th className="px-6 py-4">Plano</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-center">Ações</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredUsers.map(u => (
                                                    <tr key={u.id} className="hover:bg-white/5 cursor-pointer transition-colors" onClick={() => setSelectedUserId(u.id)}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden"><img src={u.avatar} className="w-full h-full object-cover" /></div>
                                                                <div><p className="font-bold text-white">{u.name}</p><p className="text-slate-500 text-xs">{u.email}</p></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-bold text-xs">{u.plan}</span></td>
                                                        <td className="px-6 py-4"><span className={`font-bold text-xs ${u.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{u.status === 'active' ? 'ATIVO' : 'SUSPENSO'}</span></td>
                                                        <td className="px-6 py-4 text-center text-primary font-bold hover:underline">Gerenciar</td>
                                                    </tr>
                                                ))}
                                                {filteredUsers.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum usuário encontrado.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
                
                {/* TAB: PLANS */}
                {activeTab === 'plans' && (
                    <div className="animate-fade-in">
                         <h2 className="text-2xl font-bold mb-6">Planos & Limites</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plans.map(plan => (
                                <div key={plan.id} className="bg-[#111] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold">{plan.name}</h3>
                                        <span className="material-symbols-outlined text-slate-600">diamond</span>
                                    </div>
                                    <p className="text-3xl font-bold text-primary mb-1">{plan.price}</p>
                                    <p className="text-sm text-slate-500 mb-6">Limite: {plan.maxCredits} créditos</p>
                                    
                                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-black/40 p-2 rounded-lg">
                                        <span className="material-symbols-outlined text-base">group</span>
                                        {plan.usersCount} usuários ativos
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <p className="text-xs text-slate-600 text-center">Configuração única</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                )}

                {/* TAB: MODERATION */}
                {activeTab === 'moderation' && (
                     <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Moderação de Fotos</h2>
                        <p className="text-slate-400 mb-6">Últimas 50 fotos processadas na plataforma.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {photos.map(photo => (
                                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-black border border-white/10">
                                    <img src={photo.enhanced_url || photo.original_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                        <p className="text-xs font-bold truncate">{photo.users?.name}</p>
                                        <p className="text-[10px] text-slate-400">{new Date(photo.date).toLocaleDateString()}</p>
                                        <button 
                                            onClick={() => handleDeletePhoto(photo.id)}
                                            className="mt-2 bg-red-500/20 text-red-500 text-xs py-1 rounded border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            Apagar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </main>
        </div>

        {/* CREATE USER MODAL */}
        {showUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#151515] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-xl font-bold text-white">Novo Usuário</h2>
                         <button onClick={() => setShowUserModal(false)} className="text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">Nome Completo</label>
                            <input 
                                type="text" 
                                value={newUserName} 
                                onChange={e => setNewUserName(e.target.value)} 
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Ex: Maria Silva"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">E-mail (Login)</label>
                            <input 
                                type="email" 
                                value={newUserEmail} 
                                onChange={e => setNewUserEmail(e.target.value)} 
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="cliente@email.com"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase tracking-wide">Plano</label>
                            <input 
                                type="text" 
                                value="Avançado" 
                                disabled
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-slate-400 outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button 
                            onClick={handleCreateUser} 
                            disabled={loadingAction} 
                            className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:bg-[#45b822] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loadingAction ? 'Criando...' : 'Criar Cadastro'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;