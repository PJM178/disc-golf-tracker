import History from "@/components/History";
import styles from "./page.module.css";
import CurrentGame from "@/components/CurrentGame";

export default function Home() {
  return (
    <main className={styles["main"]}>
      <CurrentGame />
      <History />
    </main>
  );
}
