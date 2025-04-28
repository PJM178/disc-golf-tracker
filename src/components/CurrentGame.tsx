"use client"

import { memo, useState } from "react";
import styles from "./CurrentGame.module.css"
import Dialog from "./Dialog";
import { Switch } from "./Buttons";
import { ProgressActivity } from "./Loading";
import { Game, useGameState } from "@/context/GameStateContext";

interface AddPlayerInputProps {
  playerId: string;
  setNewGameProps: React.Dispatch<React.SetStateAction<{
    name: string;
    players: {
      name: string;
      id: string;
      totalScore: number;
    }[];
    location: {
      enabled: boolean;
      coord: {
        lat: number;
        long: number;
      };
    };
  }>>;
  playerName: string;
}

const AddPlayerInput = memo(function AddPlayerInput(props: AddPlayerInputProps) {
  const handleInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setNewGameProps((prevValue) => ({
      ...prevValue,
      players: prevValue.players.map((player) =>
        player.id === props.playerId
          ? { ...player, name: e.target.value }
          : player
      ),
    }));
  };

  return (
    <input
      onChange={handleInputChangeEvent}
      value={props.playerName}
    />
  );
});

interface NewGameFormProps {
  closeDialog: () => void;
}

const NewGameForm = (props: NewGameFormProps) => {
  const [newGameProps, setNewGameProps] = useState({
    name: "Uusi peli",
    players: [{ name: "", id: "p1", totalScore: 0 }],
    location: { enabled: false, coord: { lat: 0, long: 0 } },
  });

  const { setGameState } = useGameState();

  const handleGameName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGameProps({ ...newGameProps, name: e.target.value });
  };

  const handleAddPlayer = () => {
    setNewGameProps((prevValue) => ({
      ...prevValue,
      players: [
        ...prevValue.players,
        { name: "", id: "p" + (prevValue.players.length + 1), totalScore: 0 }
      ]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setGameState((prevValue) => {
      const clonedValue = { ...prevValue };
      console.log(clonedValue);
      clonedValue.currentGame = {
        id: "asd",
        name: newGameProps.name,
        players: newGameProps.players,
        location: { latitude: 0, longitude: 0 },
        holes: null,
        holeList: [],
        startTime: new Date().getTime(),
        endTime: null,
      }

      return clonedValue;
    });

    props.closeDialog();
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLInputElement).tagName === "INPUT") {
      e.preventDefault();
    }
  };

  return (
    <div className={styles["new-game-form--container"]}>
      <div className={styles["new-game-form--title"]}>
        <div>Uusi peli</div>
        <div
          className={styles["new-game-form--title-symbol--container"]}
          onClick={props.closeDialog}
        >
          <div className={`material-symbol--container material-symbols-outlined`.trim()}>
            close
          </div>
        </div>
      </div>
      <form
        className={styles["new-game-form--form--container"]}
        onSubmit={handleFormSubmit}
        onKeyDown={handleKeyDown}
      >
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-name">Nimi</label>
          <input
            name="new-game-name"
            id="new-game-name"
            onChange={handleGameName}
            value={newGameProps.name}
          />
        </div>
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-players">Pelaajat</label>
          <div id="new-game-players">
            {newGameProps.players.map((p) => (
              <AddPlayerInput
                key={p.id}
                setNewGameProps={setNewGameProps}
                playerId={p.id}
                playerName={p.name}
              />
            ))}
          </div>
          <div>
            <span className={`material-symbol--container material-symbols-outlined`.trim()}>
              person_remove
            </span>
          </div>
          <div onClick={handleAddPlayer}>
            <span>Lisää pelaaja</span>
            <span className={`material-symbol--container material-symbols-outlined`.trim()}>
              person_add
            </span>
          </div>
        </div>
        <div className={styles["new-game-form--form--input-field-row"]}>
          <label>Tallenna sijainti</label>
          <Switch isActive={newGameProps.location.enabled} onClick={() => setNewGameProps({ ...newGameProps, location: { ...newGameProps.location, enabled: !newGameProps.location.enabled } })} />
        </div>
        <div>
          <button id="close-modal">Sulje</button>
          <button>Lisää peli</button>
        </div>
      </form>
    </div>
  );
};

const NewGame = () => {
  const [isNewGameDialogOpen, setIsNewGameDialogOpen] = useState(false);

  return (
    <div className={styles["current-game--no-game"]}>
      <div
        onClick={() => setIsNewGameDialogOpen(true)}
        className={styles["current-game--new-game"]}
      >
        <b>Uusi peli&nbsp;</b>
        <span className={`material-symbol--container material-symbols-outlined`.trim()}>
          add
        </span>
      </div>
      <Dialog
        isOpen={isNewGameDialogOpen}
        closeModal={() => setIsNewGameDialogOpen(false)}
      >
        <NewGameForm closeDialog={() => setIsNewGameDialogOpen(false)} />
      </Dialog>
    </div>
  );
};

interface RunningGameProps {
  currentGame: Game;
}

const RunningGame = (props: RunningGameProps) => {
  return (
    <div>
      the current running game data is here
    </div>
  );
};

const CurrentGame = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const { gameState, isLoading } = useGameState();

  console.log(gameState);
  // useEffect(() => {
  //   console.log(localStorage.getItem("gameState"));
  //   localStorage.setItem("gameState", JSON.stringify({ score: 10 }));
  //   gameState = localStorage.getItem("gameState");
  //   setIsLoading(false);
  // }, []);

  if (isLoading) {
    return (
      <div className={styles["current-game--loading-container"]}>
        <ProgressActivity className="loading-icon" />
      </div>
    );
  }

  if (!gameState?.currentGame) {
    return (
      <NewGame />
    );
  }

  return (
    <RunningGame currentGame={gameState.currentGame} />
  );
};

export default CurrentGame;