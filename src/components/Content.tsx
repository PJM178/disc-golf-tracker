"use client"

import { useState } from "react";
import CurrentGame from "./CurrentGame";
import History from "./History";
import PaneSelector from "./PaneSelector";
import StateContainer from "./StateContainer";

export type CurrentPaneType = "home" | "history";

const Content = () => {
  const [currentPane, setCurrentPane] = useState<CurrentPaneType>("home");

  return (
    <>
      {currentPane === "home" &&
        <StateContainer name="nykyinen">
          <CurrentGame />
        </StateContainer>}
      {currentPane === "history" &&
        <StateContainer name="historia">
          <History />
        </StateContainer>}
      <PaneSelector currentPane={currentPane} setCurrentPane={setCurrentPane} />
    </>
  );
};

export default Content;