/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable react/prop-types */
// import "@components/dialog/Dialog.scss";
// import Button from "@components/button/Button";

import Button from "../button/Button";

interface IDialogProps {
  title: any;
  firstButtonText: any;
  secondButtonText: any;
  firstBtnHandler: any;
  secondBtnHandler: any;
}

const Dialog: FC<IDialogProps> = ({
  title,
  firstButtonText,
  secondButtonText,
  firstBtnHandler,
  secondBtnHandler,
}) => {
  return (
    <div className="dialog-container" data-testid="dialog-container">
      <div className="dialog">
        <h4>{title}</h4>
        <div className="btn-container">
          <Button
            className="btn button cancel-btn"
            label={secondButtonText}
            handleClick={secondBtnHandler}
          />
          <Button
            className="btn button confirm-btn"
            label={firstButtonText}
            handleClick={firstBtnHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
