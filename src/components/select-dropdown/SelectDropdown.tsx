import React, { FunctionComponent, useRef } from "react";
import { useDispatch } from "react-redux";

import "./SelectDropdown.scss";
import { updatePostItem } from "../../redux-toolkit/reducers/post/post.reducer";
import { Item } from "../posts/post-modal/modal-box-content/ModalBoxContent";

type SelectDropdownProps = {
  isActive: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item>>;
  items: Item[];
};

const SelectDropdown: FunctionComponent<SelectDropdownProps> = ({
  isActive,
  setSelectedItem,
  items = [],
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const selectItem = (item: Item) => {
    setSelectedItem(item);
    dispatch(updatePostItem({ privacy: item.topText }));
  };

  return (
    <div className="menu-container" data-testid="menu-container">
      <nav
        ref={dropdownRef}
        className={`menu ${isActive ? "active" : "inactive"}`}
      >
        <ul>
          {items.map((item, index) => (
            <li
              data-testid="select-dropdown"
              key={index}
              onClick={() => selectItem(item)}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-text">
                <div className="menu-text-header">{item.topText}</div>
                <div className="sub-header">{item.subText}</div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SelectDropdown;
