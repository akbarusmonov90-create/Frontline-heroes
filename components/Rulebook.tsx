
import React from 'react';

interface RulebookProps {
  onBack: () => void;
  onFactions: () => void;
}

const Rulebook: React.FC<RulebookProps> = ({ onBack, onFactions }) => {
  return (
    <div className="h-full w-full flex flex-col bg-neutral-900 p-8 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-8 border-b border-amber-500/30 pb-4">
          <h2 className="text-4xl font-cinzel text-amber-500">OFFICIAL RULEBOOK</h2>
          <div className="space-x-4">
            <button onClick={onFactions} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 font-cinzel transition-all">
              VIEW FACTIONS
            </button>
            <button onClick={onBack} className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-2 transition-all">
              BACK
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide space-y-10 text-neutral-300 leading-relaxed">
          <section>
            <h3 className="text-2xl font-cinzel text-white mb-4">I. CORE CONCEPT</h3>
            <p>Frontline Heroes is a turn-based tactical card game where every card is a HERO. There are NO spells. The game focuses on sacrifice and risk management.</p>
          </section>

          <section>
            <h3 className="text-2xl font-cinzel text-white mb-4">II. WIN CONDITION</h3>
            <p>A player LOSES immediately when their <span className="text-red-500 font-bold">death counter reaches 10</span>. Death is permanent; returning a hero to the board does not undo the death count unless specified by a rare effect.</p>
          </section>

          <section>
            <h3 className="text-2xl font-cinzel text-white mb-4">III. COMBAT: THE DUEL</h3>
            <div className="bg-neutral-800 p-4 border-l-4 border-amber-500 mb-4">
              <p className="font-bold text-white mb-2">ABSOLUTE RULE: THE COUNTERATTACK</p>
              <p>Every attack is a duel. When an attacker strikes, the defender ALWAYS deals counterattack damage back to the attacker simultaneously.</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Occurs even if the defender dies.</li>
                <li>Counterattack target is ALWAYS the attacker.</li>
                <li>This rule cannot be bypassed or canceled.</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-cinzel text-white mb-4">IV. TURN STRUCTURE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p><span className="text-amber-400 font-bold">1. DRAW PHASE:</span> Draw 1 card (except 1st player, 1st turn).</p>
                <p><span className="text-amber-400 font-bold">2. PLACEMENT PHASE:</span> Place heroes from hand into empty slots (max 3).</p>
                <p><span className="text-amber-400 font-bold">3. ATTACK PHASE:</span> Select up to 3 attackers and their targets.</p>
              </div>
              <div className="space-y-2">
                <p><span className="text-amber-400 font-bold">4. BATTLE RESOLUTION:</span> Resolve duels, apply deaths, and effects.</p>
                <p><span className="text-amber-400 font-bold">5. RECOVERY PHASE:</span> Surviving heroes of the active player recover ALL HP.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-cinzel text-white mb-4">V. FACTION FUSION</h3>
            <p>You must merge TWO different factions to create your 10-card deck. Each faction brings unique synergies and strategic depth.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rulebook;
