import { createPortal } from "react-dom";
import styles from "./Dialog.module.css";
import { useRef } from "react";

interface DialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
  containerClassname?: string;
}

const Dialog = (props: DialogProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogContainerRef = useRef<HTMLDivElement>(null);

  const handleCloseModal = () => {
    if (backdropRef.current && dialogContainerRef.current) {
      backdropRef.current.style.opacity = "0";
      dialogContainerRef.current.style.opacity = "0";
    }
  }

  const handleOnTransitionEnd = () => {
    props.closeModal();
  };

  if (props.isOpen) {
    return createPortal(
      <div className={styles["container"]}>
        <div
          ref={backdropRef}
          className={styles["backdrop"]}
          onClick={handleCloseModal}
          onTransitionEnd={handleOnTransitionEnd}
        />
        <div ref={dialogContainerRef} className={`${styles["dialog-content--container"]} ${props.containerClassname ?? ""}`.trim()}>
          <div className={styles["dialog-content--content"]}>
            {props.children}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
};

export default Dialog;