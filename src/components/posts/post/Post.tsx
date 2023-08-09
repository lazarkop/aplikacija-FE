import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { find } from "lodash";
import "./Post.scss";
import { useDispatch, useSelector } from "react-redux";
import { FC, useState } from "react";

import Avatar from "../../avatar/Avatar";
import { timeAgo } from "../../../services/utils/timeago.utils";
import { Utils } from "../../../services/utils/utils.service";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { postService } from "../../../services/api/post/post.service";
import Dialog from "../../dialog/Dialog";
import {
  openModal,
  toggleDeleteDialog,
} from "../../../redux-toolkit/reducers/modal/modal.reducer";
import { feelingsList, privacyList } from "../../../services/utils/static.data";
import {
  clearPost,
  updatePostItem,
} from "../../../redux-toolkit/reducers/post/post.reducer";
import CommentInputBox from "../comments/comment-input/CommentInputBox";
import CommentsModal from "../comments/comments-modal/CommentsModal";
import PostCommentSection from "../post-comment-section/PostCommentSection";
import ReactionsModal from "../reactions/reactions-modal/ReactionsModal";
import ImageModal from "../../image-modal/ImageModal";
import { RootState } from "../../../redux-toolkit/store";
import axios from "axios";

export interface IPost {
  _id: string;
  post: string;
  bgColor: string;
  privacy: string;
  feelings: string;
  gifUrl: string;
  profilePicture: string;
  image: string;
  userId: string;
  username: string;
  email: string;
  avatarColor: string;
  commentsCount: number;
  reactions: [];
  imgVersion: string;
  imgId: string;
  createdAt: string | Date;
}

interface IPostProps {
  post: IPost;
  showIcons?: boolean;
}

const Post: FC<IPostProps> = ({ post, showIcons }) => {
  const { _id } = useSelector((state: RootState) => state.post);
  const { reactionsModalIsOpen, commentsModalIsOpen, deleteDialogIsOpen } =
    useSelector((state: RootState) => state.modal);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const selectedPostId = useLocalStorage("selectedPostId", "get");
  const dispatch = useDispatch();

  const getFeeling = (name: string) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.image;
  };

  const getPrivacy = (type: string) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon;
  };

  const deletePost = async () => {
    try {
      const response = await postService.deletePost(_id);
      if (response) {
        Utils.dispatchNotification(response.data.message, "success", dispatch);
        dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
        dispatch(clearPost());
      }
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

  const openPostModal = () => {
    dispatch(openModal({ type: "edit" }));
    dispatch(updatePostItem(post));
  };

  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
    dispatch(updatePostItem(post));
  };

  return (
    <>
      {reactionsModalIsOpen && <ReactionsModal />}
      {commentsModalIsOpen && <CommentsModal />}
      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(false)}
          showArrow={false}
        />
      )}
      {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this post?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => deletePost()}
          secondBtnHandler={() => {
            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
            dispatch(clearPost());
          }}
        />
      )}
      <div className="post-body" data-testid="post">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar
                name={post?.username}
                bgColor={post?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={post?.profilePicture}
              />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <div
                      className="inline-display"
                      data-testid="inline-display"
                    >
                      is feeling{" "}
                      <img
                        className="feeling-icon"
                        src={`${getFeeling(post?.feelings)}`}
                        alt=""
                      />{" "}
                      <div>{post?.feelings}</div>
                    </div>
                  )}
                </h5>
                {showIcons && (
                  <div className="post-icons" data-testid="post-icons">
                    <FaPencilAlt className="pencil" onClick={openPostModal} />
                    <FaRegTrashAlt
                      className="trash"
                      onClick={openDeleteDialog}
                    />
                  </div>
                )}
              </div>

              {post?.createdAt && (
                <p className="time-text-display" data-testid="time-display">
                  {timeAgo.transform(post?.createdAt)} &middot;{" "}
                  {getPrivacy(post?.privacy)}
                </p>
              )}
            </div>
            <hr />
            <div
              className="user-post"
              style={{ marginTop: "1rem", borderBottom: "" }}
            >
              {post?.post && post?.bgColor === "#ffffff" && (
                <p className="post" data-testid="user-post">
                  {post?.post}
                </p>
              )}
              {post?.post && post?.bgColor !== "#ffffff" && (
                <div
                  data-testid="user-post-with-bg"
                  className="user-post-with-bg"
                  style={{ backgroundColor: `${post?.bgColor}` }}
                >
                  {post?.post}
                </div>
              )}

              {post?.imgId && !post?.gifUrl && post.bgColor === "#ffffff" && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  onClick={() => {
                    setImageUrl(Utils.getImage(post.imgId, post.imgVersion));
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img
                    className="post-image"
                    src={`${Utils.getImage(post.imgId, post.imgVersion)}`}
                    alt=""
                  />
                </div>
              )}

              {post?.gifUrl && post.bgColor === "#ffffff" && (
                <div
                  className="image-display-flex"
                  onClick={() => {
                    setImageUrl(post?.gifUrl);
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img className="post-image" src={`${post?.gifUrl}`} alt="" />
                </div>
              )}
              {(post?.reactions.length > 0 || post?.commentsCount > 0) && (
                <hr />
              )}
              <PostCommentSection post={post} />
            </div>
          </div>
          {selectedPostId === post?._id && <CommentInputBox post={post} />}
        </div>
      </div>
    </>
  );
};
export default Post;
