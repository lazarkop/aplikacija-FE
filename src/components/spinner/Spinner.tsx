/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import PropTypes from "prop-types";
import "./Spinner.scss";

const Spinner = ({ bgColor }) => {
  return (
    <>
      <div className="spinner">
        <div
          className="bounce1"
          style={{ backgroundColor: `${bgColor || "#50b5ff"}` }}
        ></div>
        <div
          className="bounce2"
          style={{ backgroundColor: `${bgColor || "#50b5ff"}` }}
        ></div>
        <div
          className="bounce3"
          style={{ backgroundColor: `${bgColor || "#50b5ff"}` }}
        ></div>
      </div>
    </>
  );
};
Spinner.propTypes = {
  bgColor: PropTypes.string,
};
export default Spinner;
