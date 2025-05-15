"use client"
import styles from "./History.module.css";
import { Game, useGameState } from "@/context/GameStateContext";

const NoHistory = () => {
  return (
    <div className={styles["history-list--no-games"]}>
      <i>Ei pelejä</i>
    </div>
  );
};

interface HistoryListProps {
  gameHistory: Game[];
}

const HistoryList = (props: HistoryListProps) => {
  const handleDateDisplay = (time: number) => {
    const date = new Date(time);

    return date.toString();
  };

  return (
    <ul className={styles["history-list--game-list"]}>
      {props.gameHistory.map((game) => (
        <li key={game.id} className={styles["history-list--game-container"]}>
          <div>
            {game.name}
          </div>
          <div>
            {handleDateDisplay(game.startTime)}
          </div>
        </li>
      ))}
    </ul>
  );
};

const History = () => {
  const { gameState } = useGameState();

  return (
    <div className={styles["history-list--container"]}>
      {gameState.history?.length === 0 || !gameState.history ?
        <NoHistory /> :
        <HistoryList gameHistory={gameState.history} />}
    </div>
  );
};

export default History;