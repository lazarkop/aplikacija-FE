import React, { ChangeEvent, FC } from "react";
import "./Input.scss";

type InputProps = {
  name: string;
  type: string;
  id?: string;
  labelText?: string;
  value?: string | number;
  className?: string;
  placeholder?: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
};

const Input: FC<InputProps> = (props) => (
  <div className="form-row">
    {props.labelText && (
      <label htmlFor={props.name} className="form-label">
        {props.labelText}
      </label>
    )}
    <input
      id={props.id}
      name={props.name}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      placeholder={props.placeholder}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      className={`form-input ${props.className}`}
      style={props.style}
      autoComplete="false"
    />
  </div>
);

export default Input;
