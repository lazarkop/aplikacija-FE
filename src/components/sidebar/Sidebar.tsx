/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
import { useSelector } from "react-redux";
import {
  fontAwesomeIcons,
  sideBarItems,
  ISidebarItem,
} from "../../services/utils/static.data";
import { RootState } from "../../redux-toolkit/store";
import { getPosts } from "../../redux-toolkit/api/posts";
import { useAppDispatch } from "../../hooks/useAppDispatch";

const Sidebar = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [sidebar, setSideBar] = useState<ISidebarItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const checkUrl = (name: string) => {
    return location.pathname.includes(name.toLowerCase());
  };

  const navigateToPage = (name: string, url: string) => {
    if (name === "Profile" && profile && profile.uId) {
      url = `${url}/${profile?.username}?${createSearchParams({
        id: profile?._id,
        uId: profile?.uId,
      })}`;
    } else if (name === "Profile" && profile) {
      url = `${url}/${profile?.username}?${createSearchParams({
        id: profile?._id,
      })}`;
    }

    if (name === "Streams") {
      dispatch(getPosts());
    }
    navigate(url);
  };

  useEffect(() => {
    setSideBar(sideBarItems);
  }, []);

  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((data) => (
            <li
              key={data.index}
              onClick={() => navigateToPage(data.name, data.url)}
            >
              <div
                data-testid="sidebar-list"
                className={`sidebar-link ${
                  checkUrl(data.name) ? "active" : ""
                }`}
              >
                <div className="menu-icon">
                  {fontAwesomeIcons[data.iconName]}
                </div>
                <div className="menu-link">
                  <span>{`${data.name}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
