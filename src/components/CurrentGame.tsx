"use client"

import { memo, useState } from "react";
import styles from "./CurrentGame.module.css"
import Dialog from "./Dialog";
import { Switch } from "./Buttons";
import { ProgressActivity } from "./Loading";
import { Game, GameState, useGameState, Hole } from "@/context/GameStateContext";
import { generateRandomId } from "@/utils/utilities";

interface AddPlayerInputProps {
  index: number;
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

  const handleRemovePlayer = () => {
    props.setNewGameProps((prevValue) => ({
      ...prevValue,
      players: prevValue.players.filter((player) => player.id !== props.playerId),
    }));
  };

  return (
    <div className={styles["new-game-form--form--players-input"]}>
      <input
        onChange={handleInputChangeEvent}
        value={props.playerName}
      />
      <div
        className={styles["new-game-form--form--players-remove-icon"]}
        onClick={props.index === 0 ? undefined : handleRemovePlayer}
      >
        <span className={`material-symbol--container material-symbols-outlined`.trim()}>
          {props.index === 0 ? undefined : "person_remove"}
        </span>
      </div>
    </div>
  );
});

interface NewGameFormProps {
  closeDialog: () => void;
}

const NewGameForm = (props: NewGameFormProps) => {
  const [newGameProps, setNewGameProps] = useState({
    name: "Uusi peli",
    holes: "0",
    players: [{ name: "", id: generateRandomId(), totalScore: 0 }],
    location: { enabled: false, coord: { lat: 0, long: 0 } },
  });

  const { setGameState } = useGameState();

  const handleGameName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGameProps({ ...newGameProps, name: e.target.value });
  };

  const handleGameHoles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) && Number(e.target.value) < 0) {
      setNewGameProps({ ...newGameProps, holes: "0" });
    } else {
      setNewGameProps({ ...newGameProps, holes: e.target.value });
    }
  };
  
  const handleGameHolesBlur = () => {
    if (!newGameProps.holes) {
      setNewGameProps({ ...newGameProps, holes: "0" })
    }
  };

  const handleAddPlayer = () => {
    setNewGameProps((prevValue) => ({
      ...prevValue,
      players: [
        ...prevValue.players,
        { name: "", id: generateRandomId(), totalScore: 0 }
      ]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log(e);
    e.preventDefault();

    const populateHoles = Array.from({ length: +newGameProps.holes }, (_, i) => {
      const hole: Hole = { hole: i + 1, scores: [], id: generateRandomId() };

      return hole;
    });

    console.log(populateHoles);

    setGameState((prevValue) => {
      const clonedValue = { ...prevValue };
      console.log(clonedValue);
      clonedValue.currentGame = {
        id: generateRandomId(),
        name: newGameProps.name,
        players: newGameProps.players,
        location: { latitude: 0, longitude: 0 },
        holes: Number(newGameProps.holes),
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
          <label htmlFor="new-game-holes">Reiät</label>
          <input
            name="new-game-holes"
            id="new-game-holes"
            onChange={handleGameHoles}
            value={newGameProps.holes}
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            pattern="[0-9]*"
            onBlur={handleGameHolesBlur}
          />
        </div>
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-players">Pelaajat</label>
          <div id="new-game-players" className={styles["new-game-form--form--players-container"]}>
            {newGameProps.players.map((p, i) => (
              <AddPlayerInput
                key={p.id}
                index={i}
                setNewGameProps={setNewGameProps}
                playerId={p.id}
                playerName={p.name}
              />
            ))}
          </div>
          <div onClick={handleAddPlayer} className={styles["new-game-form--form--add-players"]}>
            <span>Lisää pelaaja</span>
            <div className={styles["new-game-form--form--players-remove-icon"]}>
              <span className={`material-symbol--container material-symbols-outlined`.trim()}>
                person_add
              </span>
            </div>
          </div>
        </div>
        <div className={styles["new-game-form--form--input-field-row"]}>
          <label>Tallenna sijainti</label>
          <Switch isActive={newGameProps.location.enabled} onClick={() => setNewGameProps({ ...newGameProps, location: { ...newGameProps.location, enabled: !newGameProps.location.enabled } })} />
        </div>
        <div>
          <button id="close-modal" type="button">Sulje</button>
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
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const RunningGame = (props: RunningGameProps) => {
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleFinishGame = () => {
    props.setGameState((prevValue) => {
      const clonedValue = { ...prevValue };

      if (clonedValue.currentGame) {
        clonedValue.history = [clonedValue?.currentGame, ...clonedValue.history];
      }

      clonedValue.currentGame = null;

      return clonedValue;
    })
  };

  return (
    <>
      <div className={styles["running-game--container"]}>
        <div className={styles["running-game--game-info"]}>
          <div>{props.currentGame.name}</div>
          <div onClick={() => setConfirmDialog(true)}>asetukset</div>
        </div>
      </div>
      <Dialog isOpen={confirmDialog} closeModal={() => setConfirmDialog(false)}>
        <button onClick={() => setConfirmDialog(false)}>no</button>
        <button onClick={handleFinishGame}>yes</button>
      </Dialog>
    </>
  );
};

const CurrentGame = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const { gameState, isLoading, setGameState } = useGameState();

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
    <RunningGame currentGame={gameState.currentGame} setGameState={setGameState} />
  );
};

export default CurrentGame;