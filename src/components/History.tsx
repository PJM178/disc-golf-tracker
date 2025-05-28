"use client"
import { RunningGameInfo } from "./CurrentGame";
import styles from "./History.module.css";
import { Game, useGameState } from "@/context/GameStateContext";

const NoHistory = () => {
  return (
    <div className={styles["history-list--no-games"]}>
      <i>Ei pelejä</i>
    </div>
  );
};

interface HistoricalGameProps {
  game: Game;
}

const HistoricalGame = (props: HistoricalGameProps) => {
  const { game } = props;

  const handleDateDisplay = (time: number | null) => {
    if (!time) return "";

    const date = new Date(time);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "numeric", day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    return formattedDate;
  };

  return (
    <RunningGameInfo
      gameName={game.name}
      players={game.players}
      historical={true}
      date={handleDateDisplay(game.endTime)}
    />
  );
};

interface HistoryListProps {
  gameHistory: Game[];
}

const HistoryList = (props: HistoryListProps) => {
  return (
    <ul className={styles["history-list--game-list"]}>
      {props.gameHistory.map((game) => (
        <li key={game.id} className={styles["history-list--game-container"]}>
          <HistoricalGame
            game={game}
          />
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