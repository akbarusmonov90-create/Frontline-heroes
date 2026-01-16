
import React from 'react';
import { HeroCard as HeroCardType, Faction } from '../types';

interface HeroCardProps {
  card: HeroCardType;
  onClick?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  small?: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({ card, onClick, isSelected, isDisabled, small }) => {
  const factionStyles = {
    [Faction.DRAGONS]: "border-red-600 bg-red-950/20 shadow-red-900/20",
    [Faction.KNIGHTS]: "border-blue-600 bg-blue-950/20 shadow-blue-900/20",
    [Faction.NECROMANCY]: "border-green-600 bg-green-950/20 shadow-green-900/20",
    [Faction.MAGES]: "border-purple-600 bg-purple-950/20 shadow-purple-900/20",
  };

  const hpPercent = Math.max(0, (card.currentHp / card.maxHp) * 100);

  return (
    <div 
      onClick={isDisabled ? undefined : onClick}
      className={`
        relative border-2 rounded transition-all flex flex-col select-none
        ${factionStyles[card.faction]}
        ${isSelected ? 'scale-110 z-30 ring-4 ring-amber-400' : 'z-10'}
        ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:z-20 shadow-lg'}
        ${small ? 'w-24 h-36' : 'w-40 h-60'}
      `}
    >
      {/* HP Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-900 rounded-t overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300" 
          style={{ width: `${hpPercent}%` }} 
        />
      </div>

      <div className={`p-2 flex flex-col h-full ${small ? 'gap-1' : 'gap-2'}`}>
        <div className="flex justify-between items-start">
          <h5 className={`font-cinzel font-bold text-white leading-none ${small ? 'text-[10px]' : 'text-sm'}`}>
            {card.name}
          </h5>
        </div>

        <div className="flex-1 flex items-center justify-center bg-black/40 rounded">
          <span className={`font-cinzel font-black opacity-20 ${small ? 'text-2xl' : 'text-5xl'}`}>
            {card.faction[0]}
          </span>
        </div>

        <div className="flex justify-between items-center bg-black/50 px-2 py-1 rounded">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-neutral-500 font-bold uppercase">ATK</span>
            <span className={`font-bold text-amber-500 ${small ? 'text-[10px]' : 'text-base'}`}>{card.atk}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-neutral-500 font-bold uppercase">HP</span>
            <span className={`font-bold text-green-500 ${small ? 'text-[10px]' : 'text-base'}`}>{card.currentHp}</span>
          </div>
        </div>

        {!small && (
          <div className="text-[8px] text-neutral-300 line-clamp-3 italic">
            {card.effect}
          </div>
        )}
      </div>

      {card.hasAttacked && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600/80 text-white px-2 py-1 text-[10px] font-bold rounded rotate-12">
            USED
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroCard;
