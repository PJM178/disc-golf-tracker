import { useState } from "react";
import styles from "./Inputs.module.css";

interface TextFieldProps {
  label: string;
}

const TextField = (props: TextFieldProps) => {
  const [value, setValue] = useState("");

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div
      className={styles["textfield--container"]}
    >
      <label
        className={styles["textfield--label"]}
      >
        {props.label}
      </label>
      <div>
        <input
          className={styles["textfield--input"]}
          value={value}
          onChange={handleChangeValue}
        />
      </div>
    </div>
  );
};

export default TextField;