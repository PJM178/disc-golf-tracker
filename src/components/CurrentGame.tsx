"use client"

import { memo, useCallback, useEffect, useState } from "react";
import styles from "./CurrentGame.module.css"
import Dialog from "./Dialog";
import { Switch } from "./Buttons";
import { ProgressActivity } from "./Loading";
import { Game, GameState, useGameState, Hole } from "@/context/GameStateContext";
import { generateRandomId } from "@/utils/utilities";

type NewGameType = Omit<Game, "startTime" | "endTime" | "currentHole">;

interface AddPlayerInputProps {
  index: number;
  playerId: string;
  setNewGameProps: React.Dispatch<React.SetStateAction<NewGameType>>;
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
        id={props.playerId}
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
  const [newGameProps, setNewGameProps] = useState<NewGameType>({
    name: "Uusi peli",
    holes: 1,
    players: [{ name: "", id: generateRandomId(), totalScore: 0 }],
    location: null,
    id: generateRandomId(),
    holeList: [],
  });

  const { setGameState, metaData, setMetaData } = useGameState();
  console.log(metaData);
  const handleGameName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGameProps({ ...newGameProps, name: e.target.value });
  };

  const handleGameHoles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) && Number(e.target.value) < 0) {
      setNewGameProps({ ...newGameProps, holes: 1 });
    } else if (e.target.value.length === 0) {
      setNewGameProps({ ...newGameProps, holes: "" });
    } else {
      setNewGameProps({ ...newGameProps, holes: +e.target.value });
    }
  };

  const handleGameHolesBlur = () => {
    if (!newGameProps.holes) {
      setNewGameProps({ ...newGameProps, holes: 1 })
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

  // When adding new players focus the input field
  // If the field already has value, don't focus it, so in the cases when deleting players
  useEffect(() => {
    if (newGameProps.players.length > 1) {
      const element = document.getElementById(newGameProps.players[newGameProps.players.length - 1].id) as HTMLInputElement;

      if (element) {
        if (!element.value) {
          element.focus();
        }
      }
    }
  }, [newGameProps.players]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const populateHoles = Array.from({ length: Number(newGameProps.holes) || 1 }, (_, i) => {
      const hole: Hole = { hole: i + 1, scores: [...newGameProps.players], id: generateRandomId(), isActive: true };

      return hole;
    });

    setGameState((prevValue) => {
      const clonedValue = { ...prevValue };

      clonedValue.currentGame = {
        id: newGameProps.id,
        name: newGameProps.name,
        players: newGameProps.players,
        location: { latitude: 0, longitude: 0 },
        holes: newGameProps.holes || 1,
        holeList: populateHoles,
        currentHole: populateHoles[0].id,
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

  const handleLocation = async () => {
    if (!metaData || metaData.permissions.geolocation === "denied") {
      return;
    }

    if (newGameProps.location) {
      setNewGameProps({ ...newGameProps, location: null });

      return;
    }

    if (metaData.permissions.geolocation === "granted") {
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log("Latitude: ", pos.coords.latitude);
        console.log("Longitude: ", pos.coords.longitude);

        setNewGameProps({ ...newGameProps, location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } });
      });
    }

    if (metaData.permissions.geolocation === "prompt") {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("Latitude: ", pos.coords.latitude);
          console.log("Longitude: ", pos.coords.longitude);

          setNewGameProps({ ...newGameProps, location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } });
        },
        (err) => {
          setMetaData((prevValue) => {
            if (prevValue) {
              prevValue.permissions.geolocation = "denied";

              return { ...prevValue };
            }

            return prevValue;
          });

          console.error("Error prompting user: ", err.message);
        }
      );
    }
  }

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
            placeholder="Valitse "
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
          <Switch disabled={metaData && metaData.permissions.geolocation === "denied" ? true : false} isActive={newGameProps.location !== null ? true : false} onClick={handleLocation} />
        </div>
        <div className={styles["new-game-form--form--button-container"]}>
          <button
            id="close-modal"
            type="button"
          >
            Sulje
          </button>
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

interface GameHoleProps extends Hole {
  currentHole: string;
  handleHolePlayerScore: (dir: "inc" | "dec", holeId: string, playerId: string) => void;
  handleFinishHole: (holeId: string) => void;
}

// TODO: Increase and decrease player hole scores, figure out how to display the data in a pleasing way
const GameHole = memo(function GameHole(props: GameHoleProps) {
  console.log(props);
  return (
    <li className={styles["running-game--hole-info"]}>
      <div><span>Reikä&nbsp;</span><span>{props.hole}</span></div>
      {props.currentHole === props.id && <>HERE BE CURRENT HOLE</>}
      <div className={styles["running-game--hole-players--container"]}>
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
                onClick={() => props.handleHolePlayerScore("inc", props.id, p.id)}
              >
                <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
                  arrow_circle_up
                </span>
              </div>
              <div
                className={styles["running-game--hole-players--buttons--button"]}
                onClick={() => props.handleHolePlayerScore("dec", props.id, p.id)}
              >
                <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
                  arrow_circle_down
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className={styles["running-game--hole-info--finish-game--container"]}
      >
        <div
          className={styles["running-game--hole-info--finish-game--button"]}
          onClick={() => props.handleFinishHole(props.id)}
        >
          <span>Reikä valmis</span>
          <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
            check_circle
          </span>
        </div>
      </div>
    </li>
  );
});

interface RunningGameProps {
  currentGame: Game;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const RunningGame = (props: RunningGameProps) => {
  const { currentGame, setGameState } = props;
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

  // TODO: pass these as props to Game components and wrap them maybe to useCallback because they should not changeon re-renders
  const handleHolePlayerScore = useCallback((dir: "inc" | "dec", holeId: string, playerId: string) => {
    if (dir === "inc") {
      setGameState((prevValue) => {
        if (!prevValue.currentGame) return prevValue;

        return {
          ...prevValue,
          currentGame: {
            ...prevValue.currentGame,
            holeList: prevValue.currentGame.holeList.map((h) => {
              if (h.id === holeId) {
                return {
                  ...h,
                  scores: h.scores.map((p) =>
                    p.id === playerId
                      ? { ...p, totalScore: p.totalScore + 1 }
                      : p
                  ),
                };
              }

              return h;
            }),
          },
        };
      });
    } else {
      setGameState((prevValue) => {
        if (!prevValue.currentGame) return prevValue;

        return {
          ...prevValue,
          currentGame: {
            ...prevValue.currentGame,
            holeList: prevValue.currentGame.holeList.map((h) => {
              if (h.id === holeId) {
                return {
                  ...h,
                  scores: h.scores.map((p) =>
                    p.id === playerId
                      ? { ...p, totalScore: p.totalScore > 0 ? p.totalScore - 1 : p.totalScore }
                      : p
                  ),
                };
              }

              return h;
            }),
          },
        };
      });
    }
  }, [setGameState]);

  const handleFinishHole = useCallback((holeId: string) => {
    setGameState((prevValue) => {
      if (!prevValue.currentGame) return prevValue;

      return {
        ...prevValue,
        currentGame: {
          ...prevValue.currentGame,
          holeList: prevValue.currentGame.holeList.map((h) => {
            if (h.id === holeId) {
              return {
                ...h,
                isActive: !h.isActive,
              };
            }

            return h;
          }),
        },
      };
    });
  }, [setGameState]);

  return (
    <>
      <div className={styles["running-game--container"]}>
        <div className={styles["running-game--game-info"]}>
          <div>{props.currentGame.name}</div>
          <div onClick={() => setConfirmDialog(true)}>asetukset</div>
        </div>
        <ul className={styles["running-game--hole-list"]}>
          {props.currentGame.holeList.map((hole) => (
            <GameHole
              key={hole.id}
              {...hole}
              currentHole={props.currentGame.currentHole}
              handleHolePlayerScore={handleHolePlayerScore}
              handleFinishHole={handleFinishHole}
            />
          ))}
        </ul>
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