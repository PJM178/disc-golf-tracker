import styles from "./PaneSelector.module.css";
import { CurrentPaneType } from "./Content";
import { Button } from "./Buttons";

interface PaneSelectorProps {
  setCurrentPane: (currentPane: CurrentPaneType) => void;
  currentPane: CurrentPaneType;
}

const PaneSelector = (props: PaneSelectorProps) => {
  return (
    <nav className={styles["pane-selector--container"]}>
      <Button
        variant="wrapper"
        className={`${styles["pane-selector--symbol-container"]} ${props.currentPane === "home" ? "selected" : ""}`.trim()}
        onClick={() => props.setCurrentPane("home")}
      >
        <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
          home
        </span>
        <span>
          Nykyinen
        </span>
      </Button>
      <Button
        variant="wrapper"
        className={`${styles["pane-selector--symbol-container"]} ${props.currentPane === "history" ? "selected" : ""}`.trim()}
        onClick={() => props.setCurrentPane("history")}
      >
        <span className={`material-symbol--container material-symbols-outlined`.trim()}>
          history
        </span>
        <span>
          Historia
        </span>
      </Button>
    </nav >
  );
};

export default PaneSelector;