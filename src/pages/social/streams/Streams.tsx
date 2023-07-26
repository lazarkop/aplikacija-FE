import { useRef } from "react";
import { useDispatch } from "react-redux";
import "./Streams.scss";
import { Suggestions } from "../../../components/suggestions/Suggestions";
import { getUserSuggestions } from "../../../redux-toolkit/api/suggestion";
import useEffectOnce from "../../../hooks/useEffectOnce";
import { AppDispatch } from "../../../redux-toolkit/store";

const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffectOnce(() => {
    dispatch(getUserSuggestions());
  });

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <div>post form</div>
          <div>post items</div>

          <div
            ref={bottomLineRef}
            style={{ marginBottom: "50px", height: "50px" }}
          ></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
