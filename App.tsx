import React, { useState, useEffect } from 'react';
import { User, Photo, View } from './types';
import Dashboard from './components/Dashboard';
import EnhancedPhotos from './components/EnhancedPhotos';
import Profile from './components/Profile';
import ImageEditor from './components/ImageEditor';
import Plans from './components/Plans';
import PaymentMethods from './components/PaymentMethods';
import ImageGenerator from './components/ImageGenerator';
import AdminDashboard from './components/AdminDashboard';
import { LandingPage } from './components/LandingPage';
import { supabase } from './services/supabaseClient';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initial Load: Check Local Storage
  useEffect(() => {
    const savedEmail = localStorage.getItem('fotopro_user_email');
    if (savedEmail) {
        handleSimpleLogin(savedEmail);
    } else {
        setIsLoading(false);
    }
  }, []);

  // 2. Simple Login Logic (No Supabase Auth)
  const handleSimpleLogin = async (email: string) => {
      setIsLoading(true);
      try {
          // Fetch user details from DB based on Email
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (error || !userData) {
              console.error("Login falhou:", error);
              localStorage.removeItem('fotopro_user_email');
              setUser(null);
          } else {
              // Map DB user to App User
              const mappedUser: User = {
                  id: userData.id,
                  name: userData.name || 'Usuário',
                  email: userData.email || '',
                  avatar: userData.avatar || 'https://via.placeholder.com/150',
                  cpf: userData.cpf,
                  phone: userData.phone,
                  plan: userData.plan as any,
                  credits: userData.credits_used || userData.credits || 0,
                  maxCredits: userData.max_credits || 5,
                  totalEnhanced: userData.total_enhanced || 0,
                  monthlyGrowth: userData.monthly_growth || 0,
                  joinDate: new Date(userData.join_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
              };

              setUser(mappedUser);
              localStorage.setItem('fotopro_user_email', email);
              
              // Fetch Photos using the DB ID
              fetchUserPhotos(userData.id);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  // 3. Fetch Photos
  const fetchUserPhotos = async (userId: string) => {
      try {
          const { data, error } = await supabase
            .from('photos')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

          if (data) {
              const mappedPhotos: Photo[] = data.map((p: any) => ({
                  id: p.id,
                  originalUrl: p.original_url,
                  enhancedUrl: p.enhanced_url,
                  name: p.name,
                  date: new Date(p.date).toLocaleString('pt-BR'),
                  status: p.status as any,
                  description: p.description,
                  rating: p.rating
              }));
              setPhotos(mappedPhotos);
          }
      } catch (error) {
          console.error('Error fetching photos:', error);
      }
  };

  const handleLogout = async () => {
    localStorage.removeItem('fotopro_user_email');
    setUser(null);
    setCurrentView(View.Dashboard);
  };

  if (isLoading) {
      return (
          <div className="flex h-screen items-center justify-center bg-black" style={{ backgroundColor: '#000', minHeight: '100vh' }}>
              <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: '#53d22d' }}>progress_activity</span>
          </div>
      );
  }

  if (!user) {
    return <LandingPage onLogin={handleSimpleLogin} />;
  }

  const handlePhotoProcessed = async (originalUrl: string, enhancedUrl: string, description: string) => {
    const newPhotoTemp: Photo = {
      id: Date.now().toString(),
      name: `Foto Gerada`,
      originalUrl,
      enhancedUrl,
      description,
      date: 'Agora',
      status: 'completed',
      rating: 0
    };
    setPhotos([newPhotoTemp, ...photos]);
    setCurrentView(View.Photos);

    try {
        await supabase.from('photos').insert({
            user_id: user.id,
            original_url: originalUrl,
            enhanced_url: enhancedUrl,
            name: `Foto ${new Date().toLocaleDateString()}`,
            description: description,
            status: 'completed'
        });
        fetchUserPhotos(user.id);
        // Refresh User credits
        handleSimpleLogin(user.email);
    } catch (err) {
        console.error("Failed to save photo", err);
    }
  };

  const handleUpdateUser = async (updatedData: Partial<User>) => {
    setUser(prev => prev ? ({ ...prev, ...updatedData }) : null);
    try {
        await supabase.from('users').update({ name: updatedData.name }).eq('id', user.id);
    } catch (err) { console.error(err); }
  };

  const renderContent = () => {
    switch (currentView) {
      case View.Dashboard: return <Dashboard user={user} recentPhotos={photos.slice(0, 5)} onNavigate={setCurrentView} />;
      case View.Photos: return <EnhancedPhotos photos={photos} />;
      case View.Profile: return <Profile user={user} onNavigate={setCurrentView} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      case View.Plan: return <Plans />;
      case View.PaymentMethods: return <PaymentMethods onBack={() => setCurrentView(View.Profile)} />;
      case View.Editor: return <ImageEditor onProcessComplete={handlePhotoProcessed} onCancel={() => setCurrentView(View.Dashboard)} />;
      case View.Generator: return <ImageGenerator user={user} onPhotoGenerated={(url, desc) => handlePhotoProcessed(url, url, desc)} onNavigatePlan={() => setCurrentView(View.Plan)} />;
      case View.Admin: return <AdminDashboard onBack={() => setCurrentView(View.Profile)} currentUserEmail={user.email} />;
      default: return <Dashboard user={user} recentPhotos={photos} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative animate-fade-in">
      <div className="flex-grow">{renderContent()}</div>
      {currentView !== View.Editor && currentView !== View.Admin && (
        <>
            <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform">
                <button onClick={() => setCurrentView(View.Editor)} className="group relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary shadow-[0_8px_30px_rgba(83,210,45,0.4)] transition-all hover:scale-105 active:scale-95">
                    <span className="material-symbols-outlined text-black text-[36px] transition-transform group-hover:rotate-12 group-active:rotate-0">photo_camera</span>
                </button>
            </div>
            <nav className="fixed bottom-0 left-0 right-0 z-40">
                <div className="mx-auto w-full max-w-lg bg-background-light/90 dark:bg-[#0f160e]/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 pb-6 pt-2 px-6">
                    <ul className="flex items-center justify-between">
                        <li><button onClick={() => setCurrentView(View.Dashboard)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.Dashboard ? 'text-primary' : 'text-slate-400'}`}><span className="material-symbols-outlined">dashboard</span><span className="text-[10px] font-bold">Painel</span></button></li>
                        <li><button onClick={() => setCurrentView(View.Generator)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.Generator ? 'text-primary' : 'text-slate-400'}`}><span className="material-symbols-outlined">auto_awesome</span><span className="text-[10px] font-medium">Gerar</span></button></li>
                        <li className="w-12"></li>
                        <li><button onClick={() => setCurrentView(View.Plan)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.Plan ? 'text-primary' : 'text-slate-400'}`}><span className="material-symbols-outlined">credit_card</span><span className="text-[10px] font-medium">Plano</span></button></li>
                        <li><button onClick={() => setCurrentView(View.Profile)} className={`flex flex-col items-center gap-1 p-2 ${currentView === View.Profile ? 'text-primary' : 'text-slate-400'}`}><span className="material-symbols-outlined">person</span><span className="text-[10px] font-medium">Perfil</span></button></li>
                    </ul>
                </div>
            </nav>
            <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent z-30"></div>
        </>
      )}
    </div>
  );
}