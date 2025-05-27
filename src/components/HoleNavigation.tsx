import { Hole } from "@/context/GameStateContext";
import { Button } from "./Buttons";
import styles from "./HoleNavigation.module.css";

interface HoleNavigationProps {
  scrollFromButton: React.RefObject<boolean>;
  currentHoleIndex: number;
  setCurrentHoleIndex: React.Dispatch<React.SetStateAction<number>>;
  currentGameHoleList: Hole[];
}

const HoleNavigation = (props: HoleNavigationProps) => {
  const { scrollFromButton, currentHoleIndex, setCurrentHoleIndex, currentGameHoleList } = props;

  const handleScrollNextHole = () => {
    if (currentHoleIndex + 1 < currentGameHoleList.length) {
      scrollFromButton.current = true;

      setCurrentHoleIndex(currentHoleIndex + 1);

    }
  };

  const handleScrollPreviousHole = () => {
    if (currentHoleIndex !== 0) {
      scrollFromButton.current = true;

      setCurrentHoleIndex(currentHoleIndex - 1);
    }
  };

  const handleHoleOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    scrollFromButton.current = true;

    setCurrentHoleIndex(+e.target.value - 1);
  };

  return (
    <div className={styles["running-game--hole-list--nav-buttons"]}>
      <Button
        variant="secondary"
        onClick={handleScrollPreviousHole}
      >
        <span>Edellinen</span>
      </Button>
      <select
        onChange={handleHoleOptionSelect}
        value={currentHoleIndex + 1}
      >
        {currentGameHoleList.map((h) => (
          <option key={h.id}>{h.hole}</option>
        ))}
      </select>
      <Button
        variant="secondary"
        onClick={handleScrollNextHole}
      >
        <span>Seuraava</span>
      </Button>
    </div>
  );
};

export default HoleNavigation;