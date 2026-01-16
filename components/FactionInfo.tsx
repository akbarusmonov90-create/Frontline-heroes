
import React, { useState } from 'react';
import { Faction } from '../types';
import { CARDS } from '../constants';

interface FactionInfoProps {
  onBack: () => void;
}

const FactionInfo: React.FC<FactionInfoProps> = ({ onBack }) => {
  const [selected, setSelected] = useState<Faction>(Faction.DRAGONS);

  const factionStyles = {
    [Faction.DRAGONS]: "border-red-600 text-red-500 bg-red-950/20",
    [Faction.KNIGHTS]: "border-blue-600 text-blue-500 bg-blue-950/20",
    [Faction.NECROMANCY]: "border-green-600 text-green-500 bg-green-950/20",
    [Faction.MAGES]: "border-purple-600 text-purple-500 bg-purple-950/20",
  };

  return (
    <div className="h-full w-full bg-neutral-900 flex flex-col p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-cinzel text-amber-500">FACTION ARCHIVES</h2>
          <button onClick={onBack} className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-2 transition-all">
            BACK TO RULES
          </button>
        </div>

        <div className="flex space-x-4 mb-8">
          {Object.values(Faction).map(f => (
            <button
              key={f}
              onClick={() => setSelected(f)}
              className={`flex-1 py-3 font-cinzel text-lg border-b-4 transition-all ${
                selected === f ? factionStyles[f] : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 scrollbar-hide">
          {CARDS[selected].map((card, idx) => (
            <div 
              key={card.id} 
              className={`p-4 border bg-neutral-800 flex flex-col h-full ${factionStyles[selected].split(' ')[0]}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-xl font-cinzel font-bold text-white">{card.name}</h4>
                <span className="text-xs text-neutral-500">#{idx + 1}</span>
              </div>
              
              <div className="flex space-x-4 mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-500">ATK</span>
                  <span className="text-lg font-bold text-amber-500">{card.atk}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-500">HP</span>
                  <span className="text-lg font-bold text-green-500">{card.maxHp}</span>
                </div>
              </div>

              <div className="flex-1 text-sm text-neutral-300 italic mb-4">
                "{card.effect}"
              </div>

              {card.quote && (
                <div className="text-[10px] uppercase text-neutral-500 tracking-widest border-t border-neutral-700 pt-2">
                  {card.quote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FactionInfo;
