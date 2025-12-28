
import React, { useState, useRef, useEffect } from 'react';
import { AppState, UserData } from './types';
import { generateR10Wrapped } from './services/geminiService';
import Slide from './components/Slide';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [profileUrl, setProfileUrl] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const loadingMessages = [
    "2025 r10 verileri analiz ediliyor...",
    "Google indekslerinde ticaret puanın aranıyor...",
    "iTrader krallığın hesaplanıyor...",
    "Forumda kaç PM attığın tahmin ediliyor...",
    "Kategori şampiyonlukların belirleniyor...",
    "Wrapped hikayen Host Grotesk ile süsleniyor...",
    "Sektörün tozunu attırdığın anlar süzülüyor...",
    "Son dokunuşlar yapılıyor..."
  ];

  useEffect(() => {
    let interval: any;
    if (appState === AppState.LOADING) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = profileUrl.trim();
    if (!cleanUrl.toLowerCase().includes('r10.net')) {
      setError('Lütfen geçerli bir r10.net profil linki girin.');
      return;
    }

    setError('');
    setAppState(AppState.LOADING);
    
    try {
      const data = await generateR10Wrapped(cleanUrl);
      setUserData(data);
      setAppState(AppState.EXPERIENCE);
      setCurrentIndex(0);
    } catch (err) {
      setError('Veriler alınamadı. r10.net sunucuları veya profil gizliliği sorunu olabilir.');
      setAppState(AppState.ERROR);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollPosition = containerRef.current.scrollLeft;
      const width = containerRef.current.offsetWidth;
      const index = Math.round(scrollPosition / width);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  };

  const nextSlide = () => {
    if (containerRef.current && userData) {
      const nextIdx = Math.min(currentIndex + 1, userData.insights.length - 1);
      containerRef.current.scrollTo({
        left: nextIdx * containerRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const prevSlide = () => {
    if (containerRef.current) {
      const prevIdx = Math.max(currentIndex - 1, 0);
      containerRef.current.scrollTo({
        left: prevIdx * containerRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  if (appState === AppState.LANDING || appState === AppState.ERROR) {
    return (
      <div className="min-h-screen bg-[#000] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-12 relative scale-110 md:scale-125">
           <div className="absolute inset-0 bg-[#1DB954] rounded-full blur-[100px] opacity-30 animate-pulse"></div>
           <div className="bg-zinc-900 w-32 h-32 flex items-center justify-center rounded-[2.5rem] border border-zinc-800 shadow-2xl relative">
              <span className="text-7xl">⚡</span>
           </div>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-6 leading-none italic">
          R10 <span className="text-[#1DB954]">2025</span> <br/>
          <span className="text-white/20">WRAPPED</span>
        </h1>
        <p className="text-2xl md:text-4xl font-black mb-16 opacity-90 max-w-2xl leading-[1.1] uppercase italic">
          Ticaretin şahı, forumun <br/>
          <span className="text-[#1DB954] line-through decoration-white/30">eskisi</span> <span className="text-[#1DB954]">efsanesi</span> burada.
        </p>

        <form onSubmit={handleStart} className="w-full max-w-xl space-y-6">
          <input 
            type="text" 
            placeholder="r10.net/profil/username" 
            className="w-full bg-zinc-900 border-4 border-zinc-800 rounded-[2rem] py-8 px-10 text-2xl focus:outline-none focus:border-[#1DB954] transition-all font-black placeholder:opacity-10 text-center uppercase tracking-tighter"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full bg-[#1DB954] text-black font-black py-8 px-10 rounded-[2rem] text-3xl uppercase tracking-tighter hover:scale-[1.05] transition-all active:scale-95 shadow-[0_20px_50px_rgba(29,185,84,0.4)]"
          >
            HİKAYEMİ BAŞLAT ➔
          </button>
        </form>

        {error && <p className="mt-8 text-red-500 font-black bg-red-500/10 px-8 py-4 rounded-2xl border border-red-500/30 text-lg uppercase">{error}</p>}

        <p className="mt-24 text-xs opacity-20 font-black uppercase tracking-[0.5em]">
          Gerçek r10 Verileri • 2025 • Google Search Powered
        </p>
      </div>
    );
  }

  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 mb-20 relative">
          <div className="absolute inset-0 bg-[#1DB954] rounded-full blur-[60px] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 border-[12px] border-[#1DB954]/10 rounded-full"></div>
          <div className="absolute inset-0 border-[12px] border-[#1DB954] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="h-40 flex flex-col justify-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 animate-bounce text-[#1DB954] italic">
              {loadingMessages[loadingStep]}
            </h2>
            <p className="text-xl opacity-30 font-black tracking-widest uppercase italic">
              R10 Veritabanı Taranıyor
            </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black select-none">
      {/* Progress Bars */}
      <div className="absolute top-8 left-0 right-0 z-50 flex gap-1.5 px-6 md:px-12">
        {userData?.insights.map((_, idx) => (
          <div key={idx} className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-white transition-all duration-300 ${idx === currentIndex ? 'w-full' : (idx < currentIndex ? 'w-full opacity-30' : 'w-0')}`}
            />
          </div>
        ))}
      </div>

      {/* Slide Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar touch-pan-x"
        style={{ scrollBehavior: 'smooth' }}
      >
        {userData?.insights.map((insight, idx) => (
          <div key={idx} className="snap-center">
            <Slide insight={insight} isActive={idx === currentIndex} />
          </div>
        ))}
      </div>

      {/* Navigation for Desktop */}
      <div className="hidden lg:block absolute bottom-12 left-0 right-0 z-50 px-12">
        <div className="flex justify-between items-center max-w-[90rem] mx-auto">
          <button 
            onClick={prevSlide}
            className={`p-8 rounded-full bg-black/40 border-4 border-white/5 hover:border-[#1DB954] transition-all ${currentIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <div className="bg-[#1DB954] text-black px-12 py-5 rounded-[2rem] font-black text-3xl tracking-tighter uppercase italic flex flex-col items-center leading-none">
             <span>{userData?.username}</span>
             <span className="text-sm opacity-60 mt-2">2025 WRAPPED</span>
          </div>

          <button 
            onClick={nextSlide}
            className={`p-8 rounded-full bg-black/40 border-4 border-white/5 hover:border-[#1DB954] transition-all ${currentIndex === (userData?.insights.length || 0) - 1 ? 'opacity-0' : 'opacity-100'}`}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* Final Share Overlay */}
      {currentIndex === (userData?.insights.length || 0) - 1 && (
        <div className="absolute bottom-20 left-0 right-0 z-50 flex flex-col items-center gap-8 px-6">
          <div className="bg-white/10 backdrop-blur-3xl border-4 border-white/20 p-8 rounded-[3rem] text-center w-full max-w-md animate-fade-in shadow-2xl">
             <div className="text-sm font-black uppercase tracking-[0.3em] opacity-40 mb-2">Senin 2025 Rütben:</div>
             <div className="text-4xl md:text-5xl font-black text-[#1DB954] uppercase italic mb-8 leading-none tracking-tighter">
                {userData?.generatedRank}
             </div>
             <button 
                onClick={() => window.location.reload()}
                className="w-full bg-[#1DB954] text-black font-black py-6 rounded-2xl text-2xl uppercase tracking-tighter hover:scale-105 transition-all shadow-[0_10px_30px_rgba(29,185,84,0.3)] mb-4"
              >
                TEKRAR ANALİZ 🔄
              </button>
              <p className="text-white/60 text-xs font-black uppercase tracking-widest mt-2 animate-pulse">
                EKRAN GÖRÜNTÜSÜ AL VE PAYLAŞ! 📸
              </p>
          </div>
        </div>
      )}

      {/* Mobile Swipe Text */}
      <div className={`lg:hidden absolute bottom-8 left-0 right-0 text-center pointer-events-none transition-opacity duration-500 ${currentIndex === (userData?.insights.length || 0) - 1 ? 'opacity-0' : 'opacity-30'}`}>
        <p className="text-white text-xs font-black uppercase tracking-[0.6em] animate-pulse">Sola Kaydır ⮕</p>
      </div>
    </div>
  );
};

export default App;
