/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useEffect } from "react";
import "./Notification.scss";
import { FaCircle, FaRegCircle, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/avatar/Avatar";
import { Utils } from "../../../services/utils/utils.service";
import { notificationService } from "../../../services/api/notifications/notification.service";
import useEffectOnce from "../../../hooks/useEffectOnce";
import { NotificationUtils } from "../../../services/utils/notification-utils.service";
import NotificationPreview from "../../../components/dialog/NotificationPreview";
import { timeAgo } from "../../../services/utils/timeago.utils";

const Notification = () => {
  const { profile } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: "",
    imgUrl: "",
    comment: "",
    reaction: "",
    senderName: "",
  });
  const dispatch = useDispatch();

  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const markAsRead = async (notification) => {
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

  const deleteNotification = async (event, messageId) => {
    event.stopPropagation();
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

  useEffectOnce(() => {
    getUserNotifications();
  });

  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "notificationPage"
    );
  }, [profile, notifications]);

  return (
    <>
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
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        {notifications.length > 0 && (
          <div className="notifications-box">
            {notifications.map((notification) => (
              <div
                className="notification-box"
                data-testid="notification-box"
                key={notification?._id}
                onClick={() => markAsRead(notification)}
              >
                <div className="notification-box-sub-card">
                  <div className="notification-box-sub-card-media">
                    <div className="notification-box-sub-card-media-image-icon">
                      <Avatar
                        name={notification?.userFrom?.username}
                        bgColor={notification?.userFrom?.avatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={notification?.userFrom?.profilePicture}
                      />
                    </div>
                    <div className="notification-box-sub-card-media-body">
                      <h6 className="title">
                        {notification?.message}
                        <small
                          data-testid="subtitle"
                          className="subtitle"
                          onClick={(event) =>
                            deleteNotification(event, notification?._id)
                          }
                        >
                          <FaRegTrashAlt className="trash" />
                        </small>
                      </h6>
                      <div className="subtitle-body">
                        <small className="subtitle">
                          {!notification?.read ? (
                            <FaCircle className="icon" />
                          ) : (
                            <FaRegCircle className="icon" />
                          )}
                        </small>
                        <p className="subtext">
                          {timeAgo.transform(notification?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && !notifications.length && (
          <div className="notifications-box"></div>
        )}
        {!loading && !notifications.length && (
          <h3 className="empty-page" data-testid="empty-page">
            You have no notification
          </h3>
        )}
      </div>
    </>
  );
};
export default Notification;

/* import React, { useState, useEffect } from "react";
import "./Notification.scss";
import { FaCircle, FaRegCircle, FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/avatar/Avatar";
import { Utils } from "../../../services/utils/utils.service";
import { notificationService } from "../../../services/api/notifications/notification.service";
import useEffectOnce from "../../../hooks/useEffectOnce";
import { NotificationUtils } from "../../../services/utils/notification-utils.service";
import NotificationPreview from "../../../components/dialog/NotificationPreview";
import { timeAgo } from "../../../services/utils/timeago.utils";
import mongoose from "mongoose";
import { RootState } from "../../../redux-toolkit/store";
import axios from "axios";

export interface INotification {
  userTo: string;
  userFrom: string;
  message: string;
  notificationType: string;
  entityId: mongoose.Types.ObjectId;
  createdItemId: mongoose.Types.ObjectId;
  createdAt: Date;
  comment: string;
  reaction: string;
  post: string;
  imgId: string;
  imgVersion: string;
  gifUrl: string;
}

export interface INotificationDocument {
  _id: string;
  userTo: string;
  userFrom: {
    profilePicture: string;
    username: string;
    avatarColor: string;
    uId: string;
  };
  message: string;
  notificationType: string;
  entityId: mongoose.Types.ObjectId;
  createdItemId: mongoose.Types.ObjectId;
  comment: string;
  reaction: string;
  post: string;
  imgId: string;
  imgVersion: string;
  gifUrl: string;
  read?: boolean;
  createdAt?: Date;
  insertNotification(data: INotification): Promise<void>;
}

export interface INotificationDialogContent {
  post: string;
  imgUrl: string;
  comment: string;
  reaction: string;
  senderName: string;
}

const Notification = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [notifications, setNotifications] = useState<INotificationDocument[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [notificationDialogContent, setNotificationDialogContent] =
    useState<INotificationDialogContent>({
      post: "",
      imgUrl: "",
      comment: "",
      reaction: "",
      senderName: "",
    });
  const dispatch = useDispatch();

  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    }
  };

  const markAsRead = async (notification: INotificationDocument) => {
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
      }
    }
  };

  const deleteNotification = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    messageId: string
  ) => {
    event.stopPropagation();
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
      }
    }
  };

  useEffectOnce(() => {
    getUserNotifications();
  });

  useEffect(() => {
    NotificationUtils.socketIONotification(
      profile,
      notifications,
      setNotifications,
      "notificationPage"
    );
  }, [profile, notifications]);

  return (
    <>
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
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        {notifications.length > 0 && (
          <div className="notifications-box">
            {notifications.map((notification) => (
              <div
                className="notification-box"
                data-testid="notification-box"
                key={notification?._id}
                onClick={() => markAsRead(notification)}
              >
                <div className="notification-box-sub-card">
                  <div className="notification-box-sub-card-media">
                    <div className="notification-box-sub-card-media-image-icon">
                      <Avatar
                        name={notification?.userFrom?.username}
                        bgColor={notification?.userFrom?.avatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={notification?.userFrom?.profilePicture}
                      />
                    </div>
                    <div className="notification-box-sub-card-media-body">
                      <h6 className="title">
                        {notification?.message}
                        <small
                          data-testid="subtitle"
                          className="subtitle"
                          onClick={(event) =>
                            deleteNotification(event, notification?._id)
                          }
                        >
                          <FaRegTrashAlt className="trash" />
                        </small>
                      </h6>
                      <div className="subtitle-body">
                        <small className="subtitle">
                          {!notification?.read ? (
                            <FaCircle className="icon" />
                          ) : (
                            <FaRegCircle className="icon" />
                          )}
                        </small>
                        <p className="subtext">
                          {notification.createdAt instanceof Date &&
                            timeAgo.transform(notification?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && !notifications.length && (
          <div className="notifications-box"></div>
        )}
        {!loading && !notifications.length && (
          <h3 className="empty-page" data-testid="empty-page">
            You have no notification
          </h3>
        )}
      </div>
    </>
  );
};
export default Notification;
 */
