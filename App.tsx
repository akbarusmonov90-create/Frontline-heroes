
import React, { useState, useEffect, useCallback } from 'react';
import { View, Faction, GameState, PlayerState, GamePhase, HeroCard } from './types';
import { CARDS } from './constants';
import MainMenu from './components/MainMenu';
import Rulebook from './components/Rulebook';
import FactionInfo from './components/FactionInfo';
import FactionFusion from './components/FactionFusion';
import GameBoard from './components/GameBoard';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.MAIN_MENU);
  const [isVsAi, setIsVsAi] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startNewGame = useCallback((p1Factions: Faction[], p2Factions: Faction[], vsAi: boolean) => {
    const createPlayer = (id: number, name: string, factions: Faction[], isAi: boolean): PlayerState => {
      // Create deck from 2 factions: first 5 from each (total 10)
      const fullDeck = [
        ...CARDS[factions[0]].slice(0, 5).map(c => ({ ...c })),
        ...CARDS[factions[1]].slice(0, 5).map(c => ({ ...c }))
      ].sort(() => Math.random() - 0.5);

      // Starting hand is 4 cards as per request
      return {
        id,
        name,
        isAi,
        selectedFactions: factions,
        deck: fullDeck.slice(4), // Remaining 6 cards
        hand: fullDeck.slice(0, 4), // Initial 4 cards
        board: [null, null, null],
        deathPile: [],
        deathCounter: 0
      };
    };

    const initialGameState: GameState = {
      players: [
        createPlayer(0, "Player 1", p1Factions, false),
        createPlayer(1, vsAi ? "AI Overlord" : "Player 2", p2Factions, vsAi)
      ],
      activePlayerIndex: 0,
      turnCount: 1,
      phase: GamePhase.DRAW,
      logs: ["Game started. Good luck heroes."]
    };

    setGameState(initialGameState);
    setView(View.GAME);
  }, []);

  const handleExit = () => {
    setGameState(null);
    setView(View.MAIN_MENU);
  };

  return (
    <div className="w-full h-screen bg-neutral-950 text-neutral-100 overflow-hidden select-none">
      {view === View.MAIN_MENU && (
        <MainMenu 
          onStart={() => setView(View.GAME_MODE_SELECT)} 
          onRules={() => setView(View.RULEBOOK)} 
        />
      )}

      {view === View.RULEBOOK && (
        <Rulebook 
          onBack={() => setView(View.MAIN_MENU)} 
          onFactions={() => setView(View.FACTION_INFO)} 
        />
      )}

      {view === View.FACTION_INFO && (
        <FactionInfo onBack={() => setView(View.RULEBOOK)} />
      )}

      {view === View.GAME_MODE_SELECT && (
        <div className="h-full flex flex-col items-center justify-center space-y-8 bg-neutral-900 font-cinzel">
          <h2 className="text-4xl text-amber-400">SELECT MODE</h2>
          <div className="flex flex-col space-y-4 w-64">
            <button 
              onClick={() => { setIsVsAi(false); setView(View.FACTION_FUSION); }}
              className="bg-neutral-800 hover:bg-neutral-700 py-4 border border-neutral-600 transition-all text-xl"
            >
              TWO PLAYERS
            </button>
            <button 
              onClick={() => { setIsVsAi(true); setView(View.FACTION_FUSION); }}
              className="bg-neutral-800 hover:bg-neutral-700 py-4 border border-neutral-600 transition-all text-xl"
            >
              PLAY VS AI
            </button>
            <button 
              onClick={() => setView(View.MAIN_MENU)}
              className="text-neutral-500 hover:text-white pt-4 transition-all"
            >
              BACK
            </button>
          </div>
        </div>
      )}

      {view === View.FACTION_FUSION && (
        <FactionFusion 
          isVsAi={isVsAi} 
          onConfirm={startNewGame} 
          onBack={() => setView(View.GAME_MODE_SELECT)} 
        />
      )}

      {view === View.GAME && gameState && (
        <GameBoard 
          gameState={gameState} 
          setGameState={setGameState} 
          onExit={handleExit} 
        />
      )}
    </div>
  );
};

export default App;
