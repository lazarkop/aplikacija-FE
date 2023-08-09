/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import "./CommentsModal.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../avatar/Avatar";
import ReactionWrapper from "../../modal-wrappers/reaction-wrapper/ReactionWrapper";
import useEffectOnce from "../../../../hooks/useEffectOnce";
import { closeModal } from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import { clearPost } from "../../../../redux-toolkit/reducers/post/post.reducer";
import { postService } from "../../../../services/api/post/post.service";
import { Utils } from "../../../../services/utils/utils.service";

const CommentsModal = () => {
  const post = useSelector((state) => state.post);
  const [postComments, setPostComments] = useState([]);
  const dispatch = useDispatch();

  const getPostComments = async () => {
    try {
      const response = await postService.getPostComments(post?._id);
      setPostComments(response.data?.comments);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const closeCommentsModal = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };

  useEffectOnce(() => {
    getPostComments();
  });

  return (
    <>
      <ReactionWrapper closeModal={closeCommentsModal}>
        <div className="modal-comments-header">
          <h2>Comments</h2>
        </div>
        <div className="modal-comments-container">
          <ul className="modal-comments-container-list">
            {postComments.map((data) => (
              <li
                className="modal-comments-container-list-item"
                key={data?._id}
                data-testid="modal-list-item"
              >
                <div className="modal-comments-container-list-item-display">
                  <div className="user-img">
                    <Avatar
                      name={data?.username}
                      bgColor={data?.avatarColor}
                      textColor="#ffffff"
                      size={45}
                      avatarSrc={data?.profilePicture}
                    />
                  </div>
                  <div className="modal-comments-container-list-item-display-block">
                    <div className="comment-data">
                      <h1>{data?.username}</h1>
                      <p>{data?.comment}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ReactionWrapper>
    </>
  );
};
export default CommentsModal;
