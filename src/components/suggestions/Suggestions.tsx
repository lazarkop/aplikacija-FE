import { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import Button from "../button/Button";
import "./Suggestions.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store";
import { useNavigate } from "react-router-dom";
import { IUserDocument } from "../../redux-toolkit/reducers/user/user.reducer";
import { FollowersUtils } from "../../services/utils/followers-utils.service";
import { addToSuggestions } from "../../redux-toolkit/reducers/suggestions/suggestions.reducer";
import { Utils } from "../../services/utils/utils.service";
import { filter } from "lodash";
import axios from "axios";
import { ProfileUtils } from "../../services/utils/profile-utils.service";

export const Suggestions = () => {
  const suggestions = useSelector((state: RootState) => state.suggestions);
  const [users, setUsers] = useState<IUserDocument[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const followUser = async (user: IUserDocument) => {
    try {
      FollowersUtils.followUser(user, dispatch);
      const result = filter(users, (data) => data?._id !== user?._id);
      setUsers(result);
      dispatch(addToSuggestions({ users: result, isLoading: false }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    }
  };

  useEffect(() => {
    setUsers(suggestions?.users);
  }, [suggestions, users]);

  return (
    <div
      className="suggestions-list-container"
      data-testid="suggestions-container"
    >
      <div className="suggestions-header">
        <div className="title-text">Suggestions</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {users?.map((user) => (
            <div
              data-testid="suggestions-item"
              className="suggestions-item"
              key={Utils.generateString(10)}
            >
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user?.profilePicture}
              />
              <div
                className="title-text"
                onClick={() => ProfileUtils.navigateToProfile(user, navigate)}
              >
                {user?.username}
              </div>
              <div className="add-icon">
                <Button
                  label="Follow"
                  className="button follow"
                  disabled={false}
                  handleClick={() => followUser(user)}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className="view-more"
          onClick={() => navigate("/app/social/people")}
        >
          View More
        </div>
      </div>
    </div>
  );
};
