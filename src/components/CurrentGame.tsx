"use client"

import { useState } from "react";
import styles from "./CurrentGame.module.css"
import Dialog from "./Dialog";
import { Switch } from "./Buttons";

interface NewGameFormProps {
  closeDialog: () => void;
}

const NewGameForm = (props: NewGameFormProps) => {
  const [newGameProps, setNewGameProps] = useState({
    name: "Uusi peli",
    players: [],
    location: { enabled: false, coord: { lat: 0, long: 0 } },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
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
      >
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-name">Nimi</label>
          <input
            name="new-game-name"
            id="new-game-name"
            onChange={(e) => setNewGameProps({ ...newGameProps, name: e.target.value })}
            value={newGameProps.name}
          />
        </div>
        <div className={styles["new-game-form--form--input-field"]}>
          <label htmlFor="new-game-players">Pelaajat</label>
          <input
            name="new-game-players"
            id="new-game-players"
          ></input>
          <div>
          <input
            name="new-game-players"
            id="new-game-players"
          ></input>
                  <span className={`material-symbol--container material-symbols-outlined`.trim()}>
              person_remove
            </span>
          </div>
          <div>
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
          <button>Sulje</button>
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

const CurrentGame = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["title--container"]}>
        <div>Nykyinen</div>
      </div>
      <NewGame />
    </div>
  )
};

export default CurrentGame;