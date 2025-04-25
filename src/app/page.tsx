import History from "@/components/History";
import styles from "./page.module.css";
import CurrentGame from "@/components/CurrentGame";

export default function Home() {
  return (
    <main className={styles["main"]}>
      <div className={styles["container"]}>
        <div className={styles["title--container"]}>
          <div>Nykyinen</div>
        </div>
      </div>
      <CurrentGame />
      <History />
    </main>
  );
}
