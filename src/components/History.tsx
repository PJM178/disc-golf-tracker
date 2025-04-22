"use client"

import { useState } from "react";
import styles from "./History.module.css";

const NoHistory = () => {
  return (
    <div className={styles["history-list--no-games"]}>
      <i>Ei pelejä</i>
    </div>
  );
};

const History = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleIsHistoryOpen = () => {
    setIsHistoryOpen(!isHistoryOpen);
  }

  return (
    <div className={styles["container"]}>
      <div onClick={handleIsHistoryOpen} className={styles["title--container"]}>
        <div>Historia</div>
        <div className={`material-symbol--container material-symbols-outlined ${styles["symbol"]} ${isHistoryOpen ? styles["open"] : ""}`.trim()}>
          keyboard_arrow_down
        </div>
      </div>
      {isHistoryOpen &&
        <div className={styles["history-list--container"]}>
          <NoHistory />
        </div>}
    </div>
  );
};

export default History;