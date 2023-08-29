/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
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
import { socketService } from "../../services/socket/socket.service";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { ChatUtils } from "../../services/utils/chat-utils.service";
import { chatService } from "../../services/api/chat/chat.service";
import { Utils } from "../../services/utils/utils.service";

const Sidebar = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const chatList = useSelector((state: RootState) => state.chat.chatlist);
  const [sidebar, setSideBar] = useState<ISidebarItem[]>([]);
  const [chatPageName, setChatPageName] = useState("");
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

    if (name === "Chat") {
      setChatPageName("Chat");
    } else {
      leaveChatPage();
      setChatPageName("");
    }
    socketService?.socket.off("message received");
    navigate(url);
  };

  const createChatUrlParams = useCallback(
    (url: string) => {
      if (chatList && chatList.length) {
        const chatUser = chatList[0];
        const params = ChatUtils.chatUrlParams(chatUser, profile);
        ChatUtils.joinRoomEvent(chatUser, profile);
        return `${url}?${createSearchParams(params)}`;
      } else {
        return url;
      }
    },
    [chatList, profile]
  );

  const markMessagesAsRad = useCallback(
    async (user) => {
      try {
        const receiverId =
          user?.receiverUsername !== profile?.username
            ? user?.receiverId
            : user?.senderId;
        if (user?.receiverUsername === profile?.username && !user.isRead) {
          await chatService.markMessagesAsRad(profile?._id, receiverId);
        }
        const userTwoName =
          user?.receiverUsername !== profile?.username
            ? user?.receiverUsername
            : user?.senderUsername;
        await chatService.addChatUsers({
          userOne: profile?.username,
          userTwo: userTwoName,
        });
      } catch (error) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    },
    [dispatch, profile]
  );

  const leaveChatPage = async () => {
    try {
      const chatUser = chatList[0];
      const userTwoName =
        chatUser?.receiverUsername !== profile?.username
          ? chatUser?.receiverUsername
          : chatUser?.senderUsername;
      ChatUtils.privateChatMessages = [];
      await chatService.removeChatUsers({
        userOne: profile?.username,
        userTwo: userTwoName,
      });
    } catch (error) {}
  };

  useEffect(() => {
    setSideBar(sideBarItems);
  }, []);

  useEffect(() => {
    if (chatPageName === "Chat") {
      const url = createChatUrlParams("/app/social/chat/messages");
      navigate(url);
      if (chatList && chatList.length && !chatList[0].isRead) {
        markMessagesAsRad(chatList[0]);
      }
    }
  }, [
    chatList,
    chatPageName,
    createChatUrlParams,
    markMessagesAsRad,
    navigate,
  ]);

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
