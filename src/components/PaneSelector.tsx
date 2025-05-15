import styles from "./PaneSelector.module.css";
import { CurrentPaneType } from "./Content";

interface PaneSelectorProps {
  setCurrentPane: (currentPane: CurrentPaneType) => void;
  currentPane: CurrentPaneType;
}

const PaneSelector = (props: PaneSelectorProps) => {
  return (
    <nav className={styles["pane-selector--container"]}>
      <div
        className={`${styles["pane-selector--symbol-container"]} ${props.currentPane === "home" ? "selected" : ""}`.trim()}
        onClick={() => props.setCurrentPane("home")}
        
      >
        <span className={`material-symbol--container material-symbols-outlined--not-filled material-symbols-outlined`.trim()}>
          home
        </span>
      </div>
      <div
        className={`${styles["pane-selector--symbol-container"]} ${props.currentPane === "history" ? "selected" : ""}`.trim()}
        onClick={() => props.setCurrentPane("history")}
      >
        <span className={`material-symbol--container material-symbols-outlined`.trim()}>
          history
        </span>
      </div>
    </nav>
  );
};

export default PaneSelector;