import React, { FC } from "react";

interface ButtonProps {
  label: React.ReactNode;
  className?: string;
  handleClick?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = (props) => {
  const { label, className, disabled, handleClick } = props;

  return (
    <>
      <button className={className} onClick={handleClick} disabled={disabled}>
        {label}
      </button>
    </>
  );
};

export default Button;
