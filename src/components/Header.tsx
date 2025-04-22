import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles["container"]}>
      <div>
        Frisbeegolf-päiväkirja
      </div>
      <div className={`material-symbol--container material-symbols-outlined ${styles["symbol"]}`.trim()}>
        menu
      </div>
    </header>
  );
};

export default Header;