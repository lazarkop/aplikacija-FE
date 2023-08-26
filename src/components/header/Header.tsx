/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import logo from "../../assets/images/logo.svg";
import {
  FaCaretDown,
  FaCaretUp,
  FaRegBell,
  FaRegEnvelope,
} from "react-icons/fa";
import "./Header.scss";
import Avatar from "../avatar/Avatar";
import { Utils } from "../../services/utils/utils.service";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";
import MessageSidebar from "../message-sidebar/MessageSidebar";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import useSessionStorage from "../../hooks/useSessionStorage";
import { notificationService } from "../../services/api/notifications/notification.service";
import { NotificationUtils } from "../../services/utils/notification-utils.service";
import { socketService } from "../../services/socket/socket.service";
import { ChatUtils } from "../../services/utils/chat-utils.service";
import { chatService } from "../../services/api/chat/chat.service";
import { getConversationList } from "../../redux-toolkit/api/chat";
import { userService } from "../../services/api/user/user.service";
import useEffectOnce from "../../hooks/useEffectOnce";
import { sumBy } from "lodash";
import HeaderSkeleton from "./HeaderSkeleton";
import NotificationPreview from "../dialog/NotificationPreview";
import Dropdown from "../dropdown/Dropdown";
import { ProfileUtils } from "../../services/utils/profile-utils.service";

const Header = () => {
  const { profile } = useSelector((state) => state.user);
  const { chatList } = useSelector((state) => state.chat);
  const [environment, setEnvironment] = useState("");
  const [settings, setSettings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: "",
    imgUrl: "",
    comment: "",
    reaction: "",
    senderName: "",
  });
  const [messageCount, setMessageCount] = useState(0);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(
    messageRef,
    false
  );
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(
    notificationRef,
    false
  );
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(
    settingsRef,
    false
  );
  const storedUsername = useLocalStorage("username", "get");
  const deleteStorageUsername = useLocalStorage("username", "delete");
  const setLoggedIn = useLocalStorage("keepLoggedIn", "set");
  const deleteSessionPageReload = useSessionStorage("pageReload", "delete");

  const backgrounColor = `${
    environment === "DEV" || environment === "LOCAL"
      ? "#50b5ff"
      : environment === "STG"
      ? "#e9710f"
      : ""
  }`;

  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      const mappedNotifications =
        NotificationUtils.mapNotificationDropdownItems(
          response.data.notifications,
          setNotificationCount
        );
      setNotifications(mappedNotifications);
      socketService?.socket.emit("setup", { userId: storedUsername });
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const onMarkAsRead = async (notification) => {
    try {
      NotificationUtils.markMessageAsRead(
        notification?._id,
        notification,
        setNotificationDialogContent
      );
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const onDeleteNotification = async (messageId) => {
    try {
      const response = await notificationService.deleteNotification(messageId);
      Utils.dispatchNotification(response.data.message, "success", dispatch);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const openChatPage = async (notification) => {
    try {
      const params = ChatUtils.chatUrlParams(notification, profile);
      ChatUtils.joinRoomEvent(notification, profile);
      ChatUtils.privateChatMessages = [];
      const receiverId =
        notification?.receiverUsername !== profile?.username
          ? notification?.receiverId
          : notification?.senderId;
      if (
        notification?.receiverUsername === profile?.username &&
        !notification.isRead
      ) {
        await chatService.markMessagesAsRead(profile?._id, receiverId);
      }
      const userTwoName =
        notification?.receiverUsername !== profile?.username
          ? notification?.receiverUsername
          : notification?.senderUsername;
      await chatService.addChatUsers({
        userOne: profile?.username,
        userTwo: userTwoName,
      });
      navigate(`/app/social/chat/messages?${createSearchParams(params)}`);
      setIsMessageActive(false);
      dispatch(getConversationList());
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({
        dispatch,
        deleteStorageUsername,
        deleteSessionPageReload,
        setLoggedIn,
      });
      await userService.logoutUser();
      navigate("/");
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotifications();
  });

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    const count = sumBy(chatList, (notification) => {
      return !notification.isRead &&
        notification.receiverUsername === profile?.username
        ? 1
        : 0;
    });
    setMessageCount(count);
    setMessageNotifications(chatList);
  }, [chatList, profile]);

  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "header",
      setNotificationCount
    );
    NotificationUtils.socketIOMessageNotification(
      profile,
      messageNotifications,
      setMessageNotifications,
      setMessageCount,
      dispatch,
      location
    );
  }, [profile, notifications, dispatch, location, messageNotifications]);

  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMessageActive && (
            <div ref={messageRef}>
              <MessageSidebar
                profile={profile}
                messageCount={messageCount}
                messageNotifications={messageNotifications}
                openChatPage={openChatPage}
              />
            </div>
          )}
          {notificationDialogContent?.senderName && (
            <NotificationPreview
              title="Your post"
              post={notificationDialogContent?.post}
              imgUrl={notificationDialogContent?.imgUrl}
              comment={notificationDialogContent?.comment}
              reaction={notificationDialogContent?.reaction}
              senderName={notificationDialogContent?.senderName}
              secondButtonText="Close"
              secondBtnHandler={() => {
                setNotificationDialogContent({
                  post: "",
                  imgUrl: "",
                  comment: "",
                  reaction: "",
                  senderName: "",
                });
              }}
            />
          )}
          <div className="header-navbar">
            <div
              className="header-image"
              data-testid="header-image"
              onClick={() => navigate("/app/social/streams")}
            >
              <img src={logo} className="img-fluid" alt="" />
              <div className="app-name">
                Chatty
                {environment && (
                  <span
                    className="environment"
                    style={{ backgroundColor: `${backgrounColor}` }}
                  >
                    {environment}
                  </span>
                )}
              </div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              <li
                data-testid="notification-list-item"
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(true);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegBell className="header-list-icon" />
                  {notificationCount > 0 && (
                    <span
                      className="bg-danger-dots dots"
                      data-testid="notification-dots"
                    >
                      {notificationCount}
                    </span>
                  )}
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "250px", top: "20px" }}
                        data={notifications}
                        notificationCount={notificationCount}
                        title="Notifications"
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                data-testid="message-list-item"
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(true);
                  setIsNotificationActive(false);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  {messageCount > 0 && (
                    <span
                      className="bg-danger-dots dots"
                      data-testid="messages-dots"
                    ></span>
                  )}
                </span>
                &nbsp;
              </li>
              <li
                data-testid="settings-list-item"
                className="header-nav-item"
                onClick={() => {
                  setIsSettingsActive(!isSettingsActive);
                  setIsMessageActive(false);
                  setIsNotificationActive(false);
                }}
              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {!isSettingsActive ? (
                    <FaCaretDown className="header-list-icon caret" />
                  ) : (
                    <FaCaretUp className="header-list-icon caret" />
                  )}
                </span>
                {isSettingsActive && (
                  <ul className="dropdown-ul" ref={settingsRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "150px", top: "40px" }}
                        data={settings}
                        notificationCount={0}
                        title="Settings"
                        onLogout={onLogout}
                        onNavigate={() =>
                          ProfileUtils.navigateToProfile(profile, navigate)
                        }
                      />
                    </li>
                  </ul>
                )}
                <ul className="dropdown-ul">
                  <li className="dropdown-li"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;

/* import logo from "../../assets/images/logo.svg";
import {
  FaCaretDown,
  FaCaretUp,
  FaRegBell,
  FaRegEnvelope,
} from "react-icons/fa";

import "./Header.scss";
import Avatar from "../avatar/Avatar";
import { Utils } from "../../services/utils/utils.service";
import useDetectOutsideClick from "../../hooks/useDetectOutsideClick";
import MessageSidebar from "../message-sidebar/MessageSidebar";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux-toolkit/store";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import useSessionStorage from "../../hooks/useSessionStorage";
import { notificationService } from "../../services/api/notifications/notification.service";
import {
  NotificationUtils,
  INotificationDropdownItems,
} from "../../services/utils/notification-utils.service";
import { socketService } from "../../services/socket/socket.service";
import { ChatUtils } from "../../services/utils/chat-utils.service";
import { chatService } from "../../services/api/chat/chat.service";
import { getConversationList } from "../../redux-toolkit/api/chat";
import { userService } from "../../services/api/user/user.service";
import useEffectOnce from "../../hooks/useEffectOnce";
import { sumBy } from "lodash";
import HeaderSkeleton from "./HeaderSkeleton";
import NotificationPreview from "../dialog/NotificationPreview";
import Dropdown from "../dropdown/Dropdown";
import { ProfileUtils } from "../../services/utils/profile-utils.service";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import axios from "axios";
import { INotificationDocument } from "../../pages/social/notifications/Notification";

const Header = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { chatList } = useSelector((state: RootState) => state.chat);
  const [environment, setEnvironment] = useState("");
  const [settings, setSettings] = useState([]);
  const [notifications, setNotifications] = useState<
    INotificationDropdownItems[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [notificationDocuments, setNotificationDocuments] = useState<
    INotificationDocument[]
  >([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: "",
    imgUrl: "",
    comment: "",
    reaction: "",
    senderName: "",
  });
  const [messageCount, setMessageCount] = useState(0);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick(
    messageRef,
    false
  );
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick(
    notificationRef,
    false
  );
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(
    settingsRef,
    false
  );
  const storedUsername = useLocalStorage("username", "get");
  const deleteStorageUsername = useLocalStorage("username", "delete");
  const setLoggedIn = useLocalStorage("keepLoggedIn", "set");
  const deleteSessionPageReload = useSessionStorage("pageReload", "delete");

  const backgrounColor = `${
    environment === "DEV" || environment === "LOCAL"
      ? "#50b5ff"
      : environment === "STG"
      ? "#e9710f"
      : ""
  }`;

  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      setNotificationDocuments(response.data.notifications);
      const mappedNotifications =
        NotificationUtils.mapNotificationDropdownItems(
          response.data.notifications,
          setNotificationCount
        );
      console.log(mappedNotifications);
      setNotifications(mappedNotifications);
      socketService?.socket.emit("setup", { userId: storedUsername });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      } else {
        console.error(error);
      }
    }
  };

  const onMarkAsRead = async (notification: INotificationDocument) => {
    try {
      NotificationUtils.markMessageAsRead(
        notification?._id,
        notification,
        setNotificationDialogContent
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      } else {
        console.error(error);
      }
    }
  };

  const onDeleteNotification = async (messageId) => {
    try {
      const response = await notificationService.deleteNotification(messageId);
      Utils.dispatchNotification(response.data.message, "success", dispatch);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      } else {
        console.error(error);
      }
    }
  };

  const openChatPage = async (notification) => {
    try {
      const params = ChatUtils.chatUrlParams(notification, profile);
      ChatUtils.joinRoomEvent(notification, profile);
      ChatUtils.privateChatMessages = [];
      const receiverId =
        notification?.receiverUsername !== profile?.username
          ? notification?.receiverId
          : notification?.senderId;
      if (
        notification?.receiverUsername === profile?.username &&
        !notification.isRead
      ) {
        await chatService.markMessagesAsRead(profile?._id, receiverId);
      }
      const userTwoName =
        notification?.receiverUsername !== profile?.username
          ? notification?.receiverUsername
          : notification?.senderUsername;
      await chatService.addChatUsers({
        userOne: profile?.username,
        userTwo: userTwoName,
      });
      navigate(`/app/social/chat/messages?${createSearchParams(params)}`);
      setIsMessageActive(false);
      dispatch(getConversationList());
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      } else {
        console.error(error);
      }
    }
  };

  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({
        dispatch,
        deleteStorageUsername,
        deleteSessionPageReload,
        setLoggedIn,
      });
      await userService.logoutUser();
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      } else {
        console.error(error);
      }
    }
  };

  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotifications();
  });

  useEffect(() => {
    const env = Utils.appEnvironment();
    if (env) {
      setEnvironment(env);
    }
    const count = sumBy(chatList, (notification) => {
      return !notification.isRead &&
        notification.receiverUsername === profile?.username
        ? 1
        : 0;
    });
    setMessageCount(count);
    setMessageNotifications(chatList);
  }, [chatList, profile]);

  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "header",
      setNotificationCount
    );
    NotificationUtils.socketIOMessageNotification(
      profile,
      messageNotifications,
      setMessageNotifications,
      setMessageCount,
      dispatch,
      location
    );
  }, [profile, notifications, dispatch, location, messageNotifications]);

  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMessageActive && (
            <div ref={messageRef}>
              <MessageSidebar
                profile={profile}
                messageCount={messageCount}
                messageNotifications={messageNotifications}
                openChatPage={openChatPage}
              />
            </div>
          )}
          {notificationDialogContent?.senderName && (
            <NotificationPreview
              title="Your post"
              post={notificationDialogContent?.post}
              imgUrl={notificationDialogContent?.imgUrl}
              comment={notificationDialogContent?.comment}
              reaction={notificationDialogContent?.reaction}
              senderName={notificationDialogContent?.senderName}
              secondButtonText="Close"
              secondBtnHandler={() => {
                setNotificationDialogContent({
                  post: "",
                  imgUrl: "",
                  comment: "",
                  reaction: "",
                  senderName: "",
                });
              }}
            />
          )}
          <div className="header-navbar">
            <div
              className="header-image"
              data-testid="header-image"
              onClick={() => navigate("/app/social/streams")}
            >
              <img src={logo} className="img-fluid" alt="" />
              <div className="app-name">
                Chatty
                {environment && (
                  <span
                    className="environment"
                    style={{ backgroundColor: `${backgrounColor}` }}
                  >
                    {environment}
                  </span>
                )}
              </div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              <li
                data-testid="notification-list-item"
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(true);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegBell className="header-list-icon" />
                  {notificationCount > 0 && (
                    <span
                      className="bg-danger-dots dots"
                      data-testid="notification-dots"
                    >
                      {notificationCount}
                    </span>
                  )}
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "250px", top: "20px" }}
                        data={notifications}
                        notificationCount={notificationCount}
                        title="Notifications"
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                data-testid="message-list-item"
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(true);
                  setIsNotificationActive(false);
                  setIsSettingsActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  {messageCount > 0 && (
                    <span
                      className="bg-danger-dots dots"
                      data-testid="messages-dots"
                    ></span>
                  )}
                </span>
                &nbsp;
              </li>
              <li
                data-testid="settings-list-item"
                className="header-nav-item"
                onClick={() => {
                  setIsSettingsActive(!isSettingsActive);
                  setIsMessageActive(false);
                  setIsNotificationActive(false);
                }}
              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {!isSettingsActive ? (
                    <FaCaretDown className="header-list-icon caret" />
                  ) : (
                    <FaCaretUp className="header-list-icon caret" />
                  )}
                </span>
                {isSettingsActive && (
                  <ul className="dropdown-ul" ref={settingsRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: "150px", top: "40px" }}
                        data={settings}
                        notificationCount={0}
                        title="Settings"
                        onLogout={onLogout}
                        onNavigate={() =>
                          ProfileUtils.navigateToProfile(profile, navigate)
                        }
                      />
                    </li>
                  </ul>
                )}
                <ul className="dropdown-ul">
                  <li className="dropdown-li"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
 */
