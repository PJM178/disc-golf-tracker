"use client"

import { useState } from "react";
import CurrentGame from "./CurrentGame";
import History from "./History";
import PaneSelector from "./PaneSelector";
import CurrentGameContainer from "./CurrentGameContainer";
import HistoryContainer from "./HistoryContainer";

export type CurrentPaneType = "home" | "history";

const Content = () => {
  const [currentPane, setCurrentPane] = useState<CurrentPaneType>("home");

  return (
    <>
      {currentPane === "home" &&
        <CurrentGameContainer>
          <CurrentGame />
        </CurrentGameContainer>}
      {currentPane === "history" &&
        <HistoryContainer>
          <History />
        </HistoryContainer>}
      <PaneSelector currentPane={currentPane} setCurrentPane={setCurrentPane} />
    </>
  );
};

export default Content;