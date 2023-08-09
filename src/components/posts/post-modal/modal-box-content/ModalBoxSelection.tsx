import photo from "../../../../assets/images/photo.png";
import feeling from "../../../../assets/images/feeling.png";
import gif from "../../../../assets/images/gif.png";

import React, { FC, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../../input/Input";
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick";
import Feelings from "../../../feelings/Feelings";
import { ImageUtils } from "../../../../services/utils/image-utils.service";
import { toggleGifModal } from "../../../../redux-toolkit/reducers/modal/modal.reducer";
import { RootState } from "../../../../redux-toolkit/store";

type setSelectedPostImage = {
  setSelectedPostImage: React.Dispatch<React.SetStateAction<string>>;
  disableImageAndGif?: boolean;
};

const ModalBoxSelection: FC<setSelectedPostImage> = ({
  setSelectedPostImage,
  disableImageAndGif = false,
}) => {
  const { feelingsIsOpen, gifModalIsOpen } = useSelector(
    (state: RootState) => state.modal
  );
  const { post } = useSelector((state: RootState) => state.post);
  const feelingsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick(
    feelingsRef,
    feelingsIsOpen
  );
  const dispatch = useDispatch();
  const disabledImageAndGif = disableImageAndGif;

  const fileInputClicked = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ImageUtils.addFileToRedux(event, post, setSelectedPostImage, dispatch);
  };

  return (
    <>
      {toggleFeelings && (
        <div ref={feelingsRef}>
          <Feelings />
        </div>
      )}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          {!disabledImageAndGif && (
            <>
              <li
                className="post-form-list-item image-select"
                onClick={fileInputClicked}
              >
                <Input
                  name="image"
                  ref={fileInputRef}
                  type="file"
                  className="file-input"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  handleChange={handleFileChange}
                />
                <img src={photo} alt="" /> Photo
              </li>
              <li
                className="post-form-list-item"
                onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
              >
                <img src={gif} alt="" /> Gif
              </li>
            </>
          )}
          <li
            className="post-form-list-item"
            onClick={() => setToggleFeelings(!toggleFeelings)}
          >
            <img src={feeling} alt="" /> Feeling
          </li>
        </ul>
      </div>
    </>
  );
};

export default ModalBoxSelection;
