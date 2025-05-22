import { Game, Hole } from "@/context/GameStateContext";
import styles from "./PlayerScoreGrid.module.css"

interface BasePlayerScoreGridProps {
  scores: Game["players"];
}

interface PlayerScoreGridWithButtons extends BasePlayerScoreGridProps, Hole {
  hasButtons: true;
  handleHolePlayerScore: (dir: "inc" | "dec", holeId: string, playerId: string) => void;
}

interface PlayerScoreGridWithoutButtons extends BasePlayerScoreGridProps {
  hasButtons: false;
}

type PlayerScoreGridProps = PlayerScoreGridWithButtons | PlayerScoreGridWithoutButtons;

const PlayerScoreGrid = (props: PlayerScoreGridProps) => {
  return (
    <div
      className={styles["running-game--hole-players--container"]}
    >
      <div className={styles["running-game--hole-players--grid-header"]}>
        <div>Pelaaja</div>
        <div>pisteet</div>
        <div />
      </div>
      {props.scores.map((p) => (
        <div key={p.id} className={styles["running-game--hole-players--player"]}>
          <div className={styles["running-game--hole-players--player--name"]}>{p.name}</div>
          <div className={styles["running-game--hole-players--player--score"]}>{p.totalScore}</div>
          <div className={styles["running-game--hole-players--buttons--container"]}>
            <div
              className={styles["running-game--hole-players--buttons--button"]}
              onClick={props.hasButtons ? !props.isActive ? undefined : () => props.handleHolePlayerScore("inc", props.id, p.id) : undefined}
            >
              <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
                {props.hasButtons ? "arrow_circle_up" : ""}
              </span>
            </div>
            <div
              className={`${styles["running-game--hole-players--buttons--button"]} ${p.totalScore === 0 ? styles["disabled"] : ""}`.trim()}
              onClick={props.hasButtons ? !props.isActive ? undefined : p.totalScore === 0 ? undefined : () => props.handleHolePlayerScore("dec", props.id, p.id) : undefined}
            >
              <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
                {props.hasButtons ? "arrow_circle_down" : ""}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayerScoreGrid;