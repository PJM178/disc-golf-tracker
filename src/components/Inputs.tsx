import styles from "./Inputs.module.css";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant: "outlined";
}

const TextField = (props: TextFieldProps) => {
  const { variant, className, ...rest } = props;

  const textFieldStyles = {
    outlined: styles["textfield--outlined"],
  }

  return (
    <input
      {...rest}
      className={`${className} ${textFieldStyles[variant]}`.trim()}
    />
  );
};

export default TextField;