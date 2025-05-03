"use client"

import { createContext, useContext, useEffect, useState, useMemo } from "react";

export interface Player {
  id: string;
  name: string;
  totalScore: number;
}

interface HoleScore {
  playerId: string;
  score: number;
}

export interface Hole {
  hole: number;
  scores: HoleScore[];
  id: string;
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  location: {
    latitude: number;
    longitude: number;
  } | null;
  holes: number | string;
  holeList: Hole[];
  startTime: number;
  endTime: number | null;
}

export interface GameState {
  currentGame: Game | null;
  history: Game[] | [];
}

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  isLoading: boolean;
}

const GameStateContext = createContext<GameStateContextType | null>(null);

export const GameStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({ currentGame: null, history: [] });
  const [isLoading, setIsLoading] = useState(true);



  // Load the game state data from local storage on first load
  useEffect(() => {
    const savedState = localStorage.getItem("gameState");
    console.log(savedState)
    if (savedState) {
      const parsedState = JSON.parse(savedState) as GameState;

      if ("currentGame" in parsedState && "history" in parsedState) {
        setGameState(parsedState);
      }
    }

    setIsLoading(false);
  }, []);

  // Update the local storage when gameState object changes to keep it in sync
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("gameState", JSON.stringify(gameState));
    }
  }, [gameState, isLoading]);

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