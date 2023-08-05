import { useDispatch, useSelector } from "react-redux";
import "./Feelings.scss";
import {
  addPostFeeling,
  toggleFeelingModal,
} from "../../redux-toolkit/reducers/modal/modal.reducer";
import { IFeeling, feelingsList } from "../../services/utils/static.data";
import { RootState } from "../../redux-toolkit/store";

const Feelings = () => {
  const { feelingsIsOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const selectFeeling = (feeling: IFeeling) => {
    dispatch(addPostFeeling({ feeling }));
    dispatch(toggleFeelingModal(!feelingsIsOpen));
  };

  return (
    <div className="feelings-container">
      <div className="feelings-container-picker">
        <p>Feelings</p>
        <hr />
        <ul className="feelings-container-picker-list">
          {feelingsList.map((feeling) => (
            <li
              data-testid="feelings-item"
              className="feelings-container-picker-list-item"
              key={feeling.index}
              onClick={() => selectFeeling(feeling)}
            >
              <img src={feeling.image} alt="" /> <span>{feeling.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Feelings;
