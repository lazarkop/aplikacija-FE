import { useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import Button from "../button/Button";
import "./Suggestions.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store";
import { useNavigate } from "react-router-dom";
import { IUserDocument } from "../../redux-toolkit/reducers/user/user.reducer";

export const Suggestions = () => {
  const suggestions = useSelector((state: RootState) => state.suggestions);
  const [users, setUsers] = useState<IUserDocument[]>([]);
  const navigate = useNavigate();

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
          {users?.map((user, index) => (
            <div
              data-testid="suggestions-item"
              className="suggestions-item"
              key={index}
            >
              <Avatar
                name={user?.username}
                bgColor={user?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={user?.profilePicture}
              />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button
                  label="Follow"
                  className="button follow"
                  disabled={false}
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
