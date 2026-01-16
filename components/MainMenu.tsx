
import React from 'react';

interface MainMenuProps {
  onStart: () => void;
  onRules: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onRules }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/id/101/1920/1080')] opacity-20 bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950" />
      
      <div className="relative z-10 flex flex-col items-center space-y-12">
        <h1 className="text-8xl font-black font-cinzel tracking-widest text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          FRONTLINE <span className="text-amber-500">HEROES</span>
        </h1>
        
        <div className="flex flex-col space-y-6 w-80 font-cinzel">
          <button 
            onClick={onStart}
            className="group relative overflow-hidden bg-amber-600 hover:bg-amber-500 text-white py-4 px-8 text-2xl transition-all border-2 border-amber-400/50 shadow-lg"
          >
            <span className="relative z-10 font-bold">START GAME</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-white/20 skew-x-12" />
          </button>
          
          <button 
            onClick={onRules}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white py-4 px-8 text-xl transition-all border border-neutral-600"
          >
            RULES & FACTIONS
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-neutral-500 text-sm font-light">
        VER 2.0 • TACTICAL CARD COMBAT
      </div>
    </div>
  );
};

export default MainMenu;
