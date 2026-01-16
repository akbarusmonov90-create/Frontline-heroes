
import React, { useState } from 'react';
import { Faction } from '../types';

interface FactionFusionProps {
  isVsAi: boolean;
  onConfirm: (p1Factions: Faction[], p2Factions: Faction[], isVsAi: boolean) => void;
  onBack: () => void;
}

const FactionFusion: React.FC<FactionFusionProps> = ({ isVsAi, onConfirm, onBack }) => {
  const [p1Selection, setP1Selection] = useState<Faction[]>([]);
  const [p2Selection, setP2Selection] = useState<Faction[]>([]);
  const [step, setStep] = useState<1 | 2>(1);

  const factions = Object.values(Faction);

  const toggleFaction = (f: Faction, player: 1 | 2) => {
    const current = player === 1 ? p1Selection : p2Selection;
    const setter = player === 1 ? setP1Selection : setP2Selection;
    
    if (current.includes(f)) {
      setter(current.filter(x => x !== f));
    } else if (current.length < 2) {
      setter([...current, f]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (isVsAi) {
        // Randomize AI factions
        const pool = [...factions].sort(() => Math.random() - 0.5);
        const aiFactions = [pool[0], pool[1]];
        onConfirm(p1Selection, aiFactions, true);
      } else {
        setStep(2);
      }
    } else {
      onConfirm(p1Selection, p2Selection, false);
    }
  };

  const currentPlayer = step;
  const currentSelection = step === 1 ? p1Selection : p2Selection;

  return (
    <div className="h-full w-full bg-neutral-900 flex flex-col items-center justify-center p-8 font-cinzel">
      <div className="max-w-3xl w-full bg-neutral-800 border-2 border-amber-500/50 p-8 flex flex-col items-center">
        <h2 className="text-3xl text-white mb-2">FACTION FUSION</h2>
        <p className="text-amber-500 mb-8 uppercase tracking-widest text-sm">
          {isVsAi ? "Player 1 Selection" : `Player ${step} Selection`}
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          {factions.map(f => {
            const isSelected = currentSelection.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFaction(f, currentPlayer)}
                className={`py-6 border-2 transition-all flex flex-col items-center ${
                  isSelected 
                    ? "bg-amber-600 border-white text-white scale-105" 
                    : "bg-neutral-700 border-neutral-600 text-neutral-400 hover:border-amber-400"
                }`}
              >
                <span className="text-xl font-bold">{f.toUpperCase()}</span>
                <span className="text-xs opacity-60 mt-2">
                  {isSelected ? "SELECTED" : "AVAILABLE"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex space-x-4 w-full">
          <button 
            onClick={onBack}
            className="flex-1 bg-neutral-600 hover:bg-neutral-500 text-white py-3 transition-all"
          >
            CANCEL
          </button>
          <button 
            disabled={currentSelection.length < 2}
            onClick={handleNext}
            className={`flex-1 py-3 transition-all font-bold ${
              currentSelection.length === 2 
                ? "bg-amber-600 hover:bg-amber-500 text-white" 
                : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {isVsAi || step === 2 ? "START MATCH" : "NEXT PLAYER"}
          </button>
        </div>

        <div className="mt-8 flex space-x-2">
          {currentSelection.map(f => (
            <div key={f} className="px-3 py-1 bg-amber-600/20 border border-amber-600 text-amber-500 text-xs">
              {f}
            </div>
          ))}
          {Array(2 - currentSelection.length).fill(0).map((_, i) => (
            <div key={i} className="px-3 py-1 border border-dashed border-neutral-600 text-neutral-600 text-xs">
              EMPTY SLOT
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FactionFusion;
