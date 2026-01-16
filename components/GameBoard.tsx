
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GamePhase, HeroCard, View } from '../types';
import HeroCardComp from './HeroCard';

interface GameBoardProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
  onExit: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, setGameState, onExit }) => {
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [selectedBoardSlot, setSelectedBoardSlot] = useState<number | null>(null);
  const [targetSlot, setTargetSlot] = useState<number | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const opponent = gameState.players[1 - gameState.activePlayerIndex];
  
  // Calculate isVsAi to determine if we should hide opponent hand info (Local PvP vs AI)
  const isVsAi = gameState.players.some(p => p.isAi);

  // LOGGING HELPER
  const addLog = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs.slice(0, 99)]
    }));
  };

  // CHECK WIN/LOSE
  useEffect(() => {
    gameState.players.forEach(p => {
      if (p.deathCounter >= 10) {
        alert(`${p.name} has lost the war. ${gameState.players[1 - p.id].name} is victorious!`);
        onExit();
      }
    });
  }, [gameState.players, onExit]);

  // AI TURN SIMULATION
  useEffect(() => {
    if (activePlayer.isAi && !isAiProcessing) {
      setIsAiProcessing(true);
      const timer = setTimeout(() => {
        runAiTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.activePlayerIndex, gameState.phase, activePlayer.isAi, isAiProcessing]);

  const nextPhase = () => {
    setGameState(prev => {
      let nextPhase: GamePhase = prev.phase;
      let nextPlayerIdx = prev.activePlayerIndex;
      let nextTurn = prev.turnCount;

      if (prev.phase === GamePhase.DRAW) nextPhase = GamePhase.PLACEMENT;
      else if (prev.phase === GamePhase.PLACEMENT) nextPhase = GamePhase.ATTACK;
      else if (prev.phase === GamePhase.ATTACK) nextPhase = GamePhase.BATTLE;
      else if (prev.phase === GamePhase.BATTLE) nextPhase = GamePhase.RECOVERY;
      else if (prev.phase === GamePhase.RECOVERY) {
        nextPhase = GamePhase.DRAW;
        nextPlayerIdx = 1 - prev.activePlayerIndex;
        nextTurn = prev.turnCount + 1;
      }

      return {
        ...prev,
        phase: nextPhase,
        activePlayerIndex: nextPlayerIdx,
        turnCount: nextTurn
      };
    });
    setSelectedHandIndex(null);
    setSelectedBoardSlot(null);
    setTargetSlot(null);
  };

  const handleDraw = () => {
    if (gameState.phase !== GamePhase.DRAW) return;

    // Special rule: first player doesn't draw turn 1
    if (gameState.turnCount === 1 && gameState.activePlayerIndex === 0) {
      addLog("Player 1 skips first draw.");
      nextPhase();
      return;
    }

    setGameState(prev => {
      const p = prev.players[prev.activePlayerIndex];
      if (p.deck.length === 0) {
        addLog(`${p.name} deck is empty.`);
        return prev;
      }
      const [card, ...rest] = p.deck;
      const newPlayers = [...prev.players];
      newPlayers[prev.activePlayerIndex] = {
        ...p,
        deck: rest,
        hand: [...p.hand, card]
      };
      return { ...prev, players: newPlayers as [any, any] };
    });
    addLog(`${activePlayer.name} draws a hero.`);
    nextPhase();
  };

  const handlePlace = (slot: number) => {
    if (gameState.phase !== GamePhase.PLACEMENT || selectedHandIndex === null) return;
    if (activePlayer.board[slot] !== null) return;

    setGameState(prev => {
      const p = prev.players[prev.activePlayerIndex];
      const card = p.hand[selectedHandIndex];
      const newHand = p.hand.filter((_, i) => i !== selectedHandIndex);
      const newBoard = [...p.board];
      newBoard[slot] = card;

      const newPlayers = [...prev.players];
      newPlayers[prev.activePlayerIndex] = { ...p, hand: newHand, board: newBoard };
      return { ...prev, players: newPlayers as [any, any] };
    });
    addLog(`${activePlayer.name} deploys ${activePlayer.hand[selectedHandIndex].name}.`);
    setSelectedHandIndex(null);
  };

  const resolveDuel = () => {
    if (selectedBoardSlot === null || targetSlot === null) return;
    
    const attacker = activePlayer.board[selectedBoardSlot];
    const defender = opponent.board[targetSlot];

    if (!attacker || !defender) return;
    if (attacker.hasAttacked) return;

    addLog(`Battle: ${attacker.name} vs ${defender.name}!`);

    setGameState(prev => {
      const newPlayers = [...prev.players];
      const pIdx = prev.activePlayerIndex;
      const oIdx = 1 - pIdx;

      const atkCopy = { ...newPlayers[pIdx].board[selectedBoardSlot]! };
      const defCopy = { ...newPlayers[oIdx].board[targetSlot]! };

      // 1. Attacker hits defender
      defCopy.currentHp -= atkCopy.atk;
      // 2. Defender counterattacks attacker (ALWAYS)
      atkCopy.currentHp -= defCopy.atk;

      atkCopy.hasAttacked = true;

      // Handle deaths
      if (defCopy.currentHp <= 0) {
        addLog(`${defCopy.name} falls!`);
        newPlayers[oIdx].deathPile.push(defCopy);
        newPlayers[oIdx].board[targetSlot] = null;
        newPlayers[oIdx].deathCounter += 1;
      } else {
        newPlayers[oIdx].board[targetSlot] = defCopy;
      }

      if (atkCopy.currentHp <= 0) {
        addLog(`${atkCopy.name} dies in the duel!`);
        newPlayers[pIdx].deathPile.push(atkCopy);
        newPlayers[pIdx].board[selectedBoardSlot] = null;
        newPlayers[pIdx].deathCounter += 1;
      } else {
        newPlayers[pIdx].board[selectedBoardSlot] = atkCopy;
      }

      return { ...prev, players: newPlayers as [any, any] };
    });

    setSelectedBoardSlot(null);
    setTargetSlot(null);
  };

  const handleRecovery = () => {
    if (gameState.phase !== GamePhase.RECOVERY) return;
    setGameState(prev => {
      const newPlayers = [...prev.players];
      const p = newPlayers[prev.activePlayerIndex];
      p.board = p.board.map(hero => {
        if (!hero) return null;
        return { ...hero, currentHp: hero.maxHp, hasAttacked: false };
      });
      return { ...prev, players: newPlayers as [any, any] };
    });
    addLog(`${activePlayer.name} survivors recover.`);
    nextPhase();
  };

  const runAiTurn = () => {
    // 1. DRAW
    if (gameState.phase === GamePhase.DRAW) {
      handleDraw();
      return;
    }
    // 2. PLACEMENT
    if (gameState.phase === GamePhase.PLACEMENT) {
      if (activePlayer.hand.length > 0 && activePlayer.board.some(s => s === null)) {
        const emptySlot = activePlayer.board.findIndex(s => s === null);
        setSelectedHandIndex(0);
        setTimeout(() => {
          handlePlace(emptySlot);
          setTimeout(() => setIsAiProcessing(false), 500);
        }, 500);
      } else {
        nextPhase();
        setIsAiProcessing(false);
      }
      return;
    }
    // 3. ATTACK
    if (gameState.phase === GamePhase.ATTACK) {
      const availableAttacker = activePlayer.board.findIndex(h => h !== null && !h.hasAttacked);
      const availableTarget = opponent.board.findIndex(h => h !== null);

      if (availableAttacker !== -1 && availableTarget !== -1) {
        setSelectedBoardSlot(availableAttacker);
        setTargetSlot(availableTarget);
        setTimeout(() => {
          resolveDuel();
          setTimeout(() => setIsAiProcessing(false), 500);
        }, 800);
      } else {
        nextPhase();
        setIsAiProcessing(false);
      }
      return;
    }
    // 4. BATTLE (usually auto-completes)
    if (gameState.phase === GamePhase.BATTLE) {
      nextPhase();
      setIsAiProcessing(false);
      return;
    }
    // 5. RECOVERY
    if (gameState.phase === GamePhase.RECOVERY) {
      handleRecovery();
      setIsAiProcessing(false);
      return;
    }
  };

  return (
    <div className="h-full w-full bg-[#121214] flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 bg-neutral-900 border-b border-neutral-800 px-6 flex items-center justify-between z-50">
        <div className="flex items-center space-x-6">
          <h1 className="font-cinzel text-xl text-amber-500 font-bold">FRONTLINE HEROES</h1>
          <div className="text-sm font-cinzel text-neutral-500">
            TURN {gameState.turnCount} • <span className="text-white">{gameState.phase.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-neutral-500 uppercase">Deaths: {activePlayer.name}</span>
            <span className={`text-xl font-bold ${activePlayer.deathCounter >= 7 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{activePlayer.deathCounter} / 10</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-neutral-500 uppercase">Deaths: {opponent.name}</span>
            <span className={`text-xl font-bold ${opponent.deathCounter >= 7 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{opponent.deathCounter} / 10</span>
          </div>
          <button 
            onClick={onExit}
            className="bg-red-950 text-red-500 border border-red-500/50 px-4 py-1 text-sm hover:bg-red-500 hover:text-white transition-all"
          >
            EXIT
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        {/* Opponent Zone */}
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            {opponent.board.map((hero, i) => (
              <div 
                key={`opp-slot-${i}`} 
                className={`w-40 h-60 border-2 border-dashed flex items-center justify-center rounded transition-all ${
                  targetSlot === i ? 'border-red-500 ring-4 ring-red-500/50 bg-red-950/20' : 'border-neutral-800'
                }`}
                onClick={() => {
                  if (gameState.phase === GamePhase.ATTACK && selectedBoardSlot !== null && hero !== null) {
                    setTargetSlot(i);
                  }
                }}
              >
                {hero ? (
                  <HeroCardComp card={hero} isDisabled small={false} />
                ) : (
                  <span className="text-neutral-800 font-cinzel text-xs uppercase">Empty Slot</span>
                )}
              </div>
            ))}
          </div>
          {/* Opponent Hand (Visible in Local Play) */}
          <div className="flex space-x-2 opacity-60">
            {opponent.hand.map((card, i) => (
              <div key={i} className="w-12 h-16 bg-neutral-800 border border-neutral-700 rounded flex items-center justify-center text-[8px] text-neutral-500 text-center">
                {(!isVsAi || false) ? "HIDDEN" : "HERO"}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
          {gameState.phase === GamePhase.DRAW && !activePlayer.isAi && (
            <button 
              onClick={handleDraw}
              className="bg-amber-600 text-white font-cinzel p-6 rounded-full hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/20 animate-pulse"
            >
              DRAW
            </button>
          )}
          {gameState.phase === GamePhase.ATTACK && selectedBoardSlot !== null && targetSlot !== null && !activePlayer.isAi && (
            <button 
              onClick={resolveDuel}
              className="bg-red-600 text-white font-cinzel p-6 rounded-full hover:bg-red-500 transition-all shadow-xl shadow-red-900/20"
            >
              DUEL!
            </button>
          )}
          {gameState.phase === GamePhase.PLACEMENT && !activePlayer.isAi && (
            <button onClick={nextPhase} className="bg-neutral-800 border border-neutral-600 px-4 py-2 hover:bg-neutral-700 transition-all">
              FINISH PLACEMENT
            </button>
          )}
           {gameState.phase === GamePhase.ATTACK && !activePlayer.isAi && (
            <button onClick={nextPhase} className="bg-neutral-800 border border-neutral-600 px-4 py-2 hover:bg-neutral-700 transition-all">
              END ATTACKS
            </button>
          )}
          {gameState.phase === GamePhase.BATTLE && !activePlayer.isAi && (
            <button onClick={nextPhase} className="bg-amber-600 border border-amber-600 px-4 py-2 hover:bg-amber-500 transition-all">
              GO TO RECOVERY
            </button>
          )}
          {gameState.phase === GamePhase.RECOVERY && !activePlayer.isAi && (
            <button 
              onClick={handleRecovery}
              className="bg-green-700 text-white font-cinzel p-6 rounded-full hover:bg-green-600 transition-all shadow-xl shadow-green-900/20"
            >
              FINISH TURN
            </button>
          )}
        </div>

        {/* My Zone */}
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            {activePlayer.board.map((hero, i) => (
              <div 
                key={`my-slot-${i}`} 
                className={`w-40 h-60 border-2 border-dashed flex items-center justify-center rounded transition-all ${
                  selectedBoardSlot === i ? 'border-amber-400 ring-4 ring-amber-400/50 bg-amber-950/20' : 'border-neutral-800'
                }`}
                onClick={() => {
                  if (gameState.phase === GamePhase.PLACEMENT && selectedHandIndex !== null) {
                    handlePlace(i);
                  } else if (gameState.phase === GamePhase.ATTACK && hero && !hero.hasAttacked) {
                    setSelectedBoardSlot(i);
                  }
                }}
              >
                {hero ? (
                  <HeroCardComp 
                    card={hero} 
                    isSelected={selectedBoardSlot === i} 
                    small={false} 
                    isDisabled={hero.hasAttacked} 
                  />
                ) : (
                  <span className="text-neutral-800 font-cinzel text-xs uppercase">
                    {gameState.phase === GamePhase.PLACEMENT && selectedHandIndex !== null ? "Place Here" : "Empty Slot"}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {/* Hand */}
          <div className="flex space-x-4 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 max-w-full overflow-x-auto">
            {activePlayer.hand.map((card, i) => (
              <HeroCardComp 
                key={card.id} 
                card={card} 
                onClick={() => setSelectedHandIndex(i === selectedHandIndex ? null : i)}
                isSelected={selectedHandIndex === i}
                isDisabled={gameState.phase !== GamePhase.PLACEMENT}
                small={true}
              />
            ))}
            {activePlayer.hand.length === 0 && (
              <div className="h-36 w-24 flex items-center justify-center text-neutral-700 font-cinzel text-[10px]">
                EMPTY HAND
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log Feed */}
      <div className="absolute right-0 top-16 bottom-0 w-64 bg-neutral-900/80 border-l border-neutral-800 p-4 flex flex-col overflow-hidden pointer-events-none">
        <h3 className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-4">Battle Log</h3>
        <div className="flex-1 overflow-y-auto space-y-2 text-[10px] scrollbar-hide">
          {gameState.logs.map((log, i) => (
            <div key={i} className={`pb-2 border-b border-neutral-800/50 ${i === 0 ? 'text-amber-400' : 'text-neutral-400'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Turn indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-8 py-2 font-cinzel rounded shadow-2xl z-40 transform -skew-x-12">
        {activePlayer.name.toUpperCase()}'S TURN
      </div>
    </div>
  );
};

export default GameBoard;
