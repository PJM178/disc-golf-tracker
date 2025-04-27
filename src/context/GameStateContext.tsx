"use client"

import { createContext, useContext, useEffect, useState, useMemo } from "react";

interface Player {
  id: string;
  name: string;
  totalScore: number;
}

interface HoleScore {
  playerId: string;
  score: number;
}

interface Hole {
  hole: number;
  scores: HoleScore[];
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  location: {
    latitude: number;
    longitude: number;
  };
  holes: number | null;
  holeList: Hole[];
  startTime: number;
  endTime: number | null;
}

interface GameState {
  currentGame: Game | null;
  history: Game[] | null;
}

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  isLoading: boolean;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({ currentGame: null, history: null });
  const [isLoading, setIsLoading] = useState(true);

  // Update the local storage when gameState object changes to keep it in sync
  useEffect(() => {
    if (gameState.currentGame) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [gameState]);

  // Load the game state data from local storage on first load
  useEffect(() => {
    const savedState = localStorage.getItem("gameState");

    if (savedState) {
      const parsedState = JSON.parse(savedState) as GameState;

      setGameState(parsedState);
    }

    setIsLoading(false);
  }, []);

  const value = useMemo(() => ({ gameState, setGameState, isLoading }), [gameState, isLoading]);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

// Use the context as hook
export const useGameState = () => {
  const context = useContext(GameStateContext);

  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }

  return context;
};