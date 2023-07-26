/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import doubleCheckmark from "../../assets/images/double-checkmark.png";
import { FaCheck, FaCircle } from "react-icons/fa";
import React from "react";
import "./MessageSidebar.scss";
import { Utils } from "../../services/utils/utils.service";
import Avatar from "../avatar/Avatar";
import { IUserDocument } from "../../redux-toolkit/reducers/user/user.reducer";

interface IMessageData {
  _id: string;
  conversationId: string;
  receiverId: string;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderId: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
  body: string;
  isRead: boolean;
  gifUrl: string;
  selectedImage: string;
  reaction: [{ type: string; senderName: string }];
  createdAt: Date;
}

interface IMessageSidebar {
  profile: IUserDocument;
  messageCount: number;
  messageNotifications: IMessageData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openChatPage: (notification: any) => Promise<void>;
}

const MessageSidebar: React.FC<IMessageSidebar> = ({
  profile,
  messageCount,
  messageNotifications,
  openChatPage,
}) => {
  return (
    <div className="message-dropdown" data-testid="message-sidebar">
      <div className="message-card">
        <div className="message-card-body">
          <div className="message-bg-primary">
            <h5 className="text-white">
              Messages
              {messageCount > 0 && (
                <small className="message-count">{messageCount}</small>
              )}
            </h5>
          </div>

          <div className="message-card-body-info">
            <div
              data-testid="info-container"
              className="message-card-body-info-container"
            >
              {messageNotifications.map((notification) => (
                <div
                  className="message-sub-card"
                  key={Utils.generateString(10)}
                  onClick={() => openChatPage(notification)}
                >
                  <div className="content-avatar">
                    <Avatar
                      name={
                        notification.receiverUsername === profile?.username
                          ? profile?.username
                          : notification?.senderUsername
                      }
                      bgColor={
                        notification.receiverUsername === profile?.username
                          ? notification.receiverAvatarColor
                          : notification?.senderAvatarColor
                      }
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={
                        notification.receiverUsername !== profile?.username
                          ? notification.receiverProfilePicture
                          : notification?.senderProfilePicture
                      }
                    />
                  </div>
                  <div className="content-body">
                    <h6 className="title">
                      {notification.receiverUsername !== profile?.username
                        ? notification.receiverUsername
                        : notification.senderUsername}
                    </h6>
                    <p className="subtext">
                      {notification?.body
                        ? notification?.body
                        : notification?.message}
                    </p>
                  </div>
                  <div className="content-icons">
                    {!notification?.isRead ? (
                      <>
                        {notification.receiverUsername === profile?.username ? (
                          <FaCircle className="circle" />
                        ) : (
                          <FaCheck className="circle not-read" />
                        )}
                      </>
                    ) : (
                      <>
                        {notification.senderUsername === profile?.username && (
                          <img
                            src={doubleCheckmark}
                            alt=""
                            className="circle read"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSidebar;
