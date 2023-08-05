import React, { useState, useEffect, useRef, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddPost.scss";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import PostWrapper from "../../modal-wrappers/post-wrapper/PostWrapper";
import ModalBoxContent from "../modal-box-content/ModalBoxContent";
import { bgColors } from "../../../../services/utils/static.data";
import ModalBoxSelection from "../modal-box-content/ModalBoxSelection";
import Button from "../../../button/Button";
import { PostUtils } from "../../../../services/utils/post-utils.service";
import {
  closeModal,
  toggleGifModal,
} from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import { ImageUtils } from "../../../../services/utils/image-utils.service";
import { postService } from "../../../../services/api/post/post.service";
import Spinner from "../../../spinner/Spinner";
import Giphy from "../../../giphy/Giphy";
import { RootState } from "../../../../redux-toolkit/store";
import axios from "axios";

interface AddPostProps {
  selectedImage?: string;
}

const AddPost: FC<AddPostProps> = ({ selectedImage }) => {
  const { gifModalIsOpen, feeling } = useSelector(
    (state: RootState) => state.modal
  );
  const { gifUrl, image, privacy } = useSelector(
    (state: RootState) => state.post
  );
  const { profile } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [postImage, setPostImage] = useState("");
  const [allowedNumberOfCharacters] = useState("1000/1000");
  const [textAreaBackground, setTextAreaBackground] = useState("#ffffff");
  const [postData, setPostData] = useState({
    post: "",
    bgColor: textAreaBackground,
    privacy: "",
    feelings: "",
    gifUrl: "",
    profilePicture: "",
    image: "",
  });
  const [disable, setDisable] = useState(true);
  const [apiResponse, setApiResponse] = useState("");
  const [selectedPostImage, setSelectedPostImage] = useState("");
  const counterRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const maxNumberOfCharacters = 1000;

  const selectBackground = (bgColor: string) => {
    PostUtils.selectBackground(
      bgColor,
      postData,
      setTextAreaBackground,
      setPostData
    );
  };

  const postInputEditable = (
    event: React.FormEvent<HTMLDivElement>,
    textContent: string | null
  ) => {
    if (event.currentTarget.textContent && counterRef.current) {
      const currentTextLength = event.currentTarget.textContent.length;
      const counter = maxNumberOfCharacters - currentTextLength;
      counterRef.current.textContent = `${counter}/1000`;
      setDisable(currentTextLength <= 0 && !postImage);
    }
    PostUtils.postInputEditable(textContent, postData, setPostData);
  };

  const closePostModal = () => {
    PostUtils.closePostModal(dispatch);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let currentTextLength;
    if (event.currentTarget.textContent) {
      currentTextLength = event.currentTarget.textContent.length;
    }
    if (
      currentTextLength === maxNumberOfCharacters &&
      event.key !== "Backspace"
    ) {
      event.preventDefault();
    }
  };

  const clearImage = () => {
    PostUtils.clearImage(
      postData,
      "",
      inputRef,
      dispatch,
      setSelectedPostImage,
      setPostImage,
      setPostData
    );
  };

  const createPost = async () => {
    setLoading(!loading);
    setDisable(!disable);
    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling?.name;
      }
      postData.privacy = privacy || "Public";
      postData.gifUrl = gifUrl;
      if (profile && profile.profilePicture) {
        postData.profilePicture = profile.profilePicture;
      }
      if (selectedPostImage || selectedImage) {
        let result = "";
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }

        if (selectedImage) {
          result = await ImageUtils.readAsBase64(selectedImage);
        }
        const response = await PostUtils.sendPostWithImageRequest(
          result,
          postData,
          imageInputRef,
          setApiResponse,
          setLoading,
          dispatch
        );
        if (response && response?.data?.message) {
          PostUtils.closePostModal(dispatch);
        }
      } else {
        const response = await postService.createPost(postData);
        if (response) {
          setApiResponse("success");
          setLoading(false);
          PostUtils.closePostModal(dispatch);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        PostUtils.dispatchNotification(
          error.response.data.message,
          "error",
          setApiResponse,
          setLoading,
          dispatch
        );
      }
    }
  };

  useEffect(() => {
    PostUtils.positionCursor("editable");
  }, []);

  useEffect(() => {
    if (!loading && apiResponse === "success") {
      dispatch(closeModal());
    }
    setDisable(postData.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, postData, postImage]);

  useEffect(() => {
    if (gifUrl) {
      setPostImage(gifUrl);
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    } else if (image) {
      setPostImage(image);
      PostUtils.postInputData(imageInputRef, postData, "", setPostData);
    }
  }, [gifUrl, image, postData]);

  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
          <div
            className="modal-box"
            style={{
              height:
                selectedPostImage ||
                gifUrl ||
                image ||
                postData?.gifUrl ||
                postData?.image
                  ? "700px"
                  : "auto",
            }}
          >
            {loading && (
              <div
                className="modal-box-loading"
                data-testid="modal-box-loading"
              >
                <span>Posting...</span>
                <Spinner />
              </div>
            )}
            <div className="modal-box-header">
              <h2>Create Post</h2>
              <button
                className="modal-box-header-cancel"
                onClick={() => closePostModal()}
              >
                X
              </button>
            </div>
            <hr />
            <ModalBoxContent />

            {!postImage && (
              <>
                <div
                  className="modal-box-form"
                  data-testid="modal-box-form"
                  style={{ background: `${textAreaBackground}` }}
                >
                  <div
                    className="main"
                    style={{
                      margin: textAreaBackground !== "#ffffff" ? "0 auto" : "",
                    }}
                  >
                    <div className="flex-row">
                      <div
                        data-testid="editable"
                        id="editable"
                        ref={inputRef}
                        className={`editable flex-item ${
                          textAreaBackground !== "#ffffff"
                            ? "textInputColor"
                            : ""
                        } ${
                          postData.post.length === 0 &&
                          textAreaBackground !== "#ffffff"
                            ? "defaultInputTextColor"
                            : ""
                        }`}
                        contentEditable={true}
                        onInput={(e) =>
                          postInputEditable(e, e.currentTarget.textContent)
                        }
                        onKeyDown={onKeyDown}
                        data-placeholder="What's on your mind?..."
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {postImage && (
              <>
                <div className="modal-box-image-form">
                  <div
                    data-testid="post-editable"
                    id="editable"
                    ref={imageInputRef}
                    className="post-input flex-item"
                    contentEditable={true}
                    onInput={(e) =>
                      postInputEditable(e, e.currentTarget.textContent)
                    }
                    onKeyDown={onKeyDown}
                    data-placeholder="What's on your mind?..."
                  ></div>
                  <div className="image-display">
                    <div
                      className="image-delete-btn"
                      data-testid="image-delete-btn"
                      onClick={() => clearImage()}
                    >
                      <FaTimes />
                    </div>
                    <img
                      data-testid="post-image"
                      className="post-image"
                      src={`${postImage}`}
                      alt=""
                    />
                  </div>
                </div>
              </>
            )}

            <div className="modal-box-bg-colors">
              <ul>
                {bgColors.map((color, index) => (
                  <li
                    data-testid="bg-colors"
                    key={index}
                    className={`${
                      color === "#ffffff" ? "whiteColorBorder" : ""
                    }`}
                    style={{ backgroundColor: `${color}` }}
                    onClick={() => {
                      PostUtils.positionCursor("editable");
                      selectBackground(color);
                    }}
                  ></li>
                ))}
              </ul>
            </div>
            <span
              className="char_count"
              data-testid="allowed-number"
              ref={counterRef}
            >
              {allowedNumberOfCharacters}
            </span>

            <ModalBoxSelection setSelectedPostImage={setSelectedPostImage} />

            <div className="modal-box-button" data-testid="post-button">
              <Button
                label="Create Post"
                className="post-button"
                disabled={disable}
                handleClick={createPost}
              />
            </div>
          </div>
        )}
        {gifModalIsOpen && (
          <div className="modal-giphy" data-testid="modal-giphy">
            <div className="modal-giphy-header">
              <Button
                label={<FaArrowLeft />}
                className="back-button"
                disabled={false}
                handleClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
              />
              <h2>Choose a GIF</h2>
            </div>
            <hr />
            <Giphy />
          </div>
        )}
      </PostWrapper>
    </>
  );
};

export default AddPost;
