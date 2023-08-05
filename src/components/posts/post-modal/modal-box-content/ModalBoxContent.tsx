import React, { useRef, useState, useCallback, useEffect } from "react";
import { FaGlobe } from "react-icons/fa";
import { useSelector } from "react-redux";
import { find } from "lodash";
import Avatar from "../../../avatar/Avatar";
import SelectDropdown from "../../../select-dropdown/SelectDropdown";
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick";
import { privacyList } from "../../../../services/utils/static.data";
import { RootState } from "../../../../redux-toolkit/store";

export interface Item {
  icon: React.ReactNode;
  topText: string;
  subText: string;
}

const ModalBoxContent = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { privacy } = useSelector((state: RootState) => state.post);
  const { feeling } = useSelector((state: RootState) => state.modal);
  const privacyRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState<Item>({
    topText: "Public",
    subText: "Anyone on Chatty",
    icon: <FaGlobe className="globe-icon globe" />,
  });
  const [tooglePrivacy, setTogglePrivacy] = useDetectOutsideClick(
    privacyRef,
    false
  );

  const displayPostPrivacy = useCallback(() => {
    if (privacy) {
      const postPrivacy = find(privacyList, (data) => data.topText === privacy);
      if (postPrivacy) {
        setSelectedItem(postPrivacy);
      }
    }
  }, [privacy]);

  useEffect(() => {
    displayPostPrivacy();
  }, [displayPostPrivacy]);

  return (
    <div className="modal-box-content" data-testid="modal-box-content">
      <div className="user-post-image" data-testid="box-avatar">
        <Avatar
          name={profile?.username}
          bgColor={profile?.avatarColor}
          textColor="#ffffff"
          size={40}
          avatarSrc={profile?.profilePicture}
        />
      </div>
      <div className="modal-box-info">
        <h5 className="inline-title-display" data-testid="box-username">
          {profile?.username}
        </h5>
        {feeling?.name && (
          <p className="inline-display" data-testid="box-feeling">
            is feeling{" "}
            <img className="feeling-icon" src={`${feeling?.image}`} alt="" />{" "}
            <span>{feeling?.name}</span>
          </p>
        )}
        <div
          data-testid="box-text-display"
          className="time-text-display"
          onClick={() => setTogglePrivacy(!tooglePrivacy)}
        >
          {selectedItem.icon}{" "}
          <div className="selected-item-text" data-testid="box-item-text">
            {selectedItem.topText}
          </div>
          <div ref={privacyRef}>
            <SelectDropdown
              isActive={tooglePrivacy}
              items={privacyList}
              setSelectedItem={setSelectedItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalBoxContent;
