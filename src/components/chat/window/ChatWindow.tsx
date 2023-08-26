/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useDispatch, useSelector } from "react-redux";
import "./ChatWindow.scss";
import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { some } from "lodash";
import Avatar from "../../avatar/Avatar";
import { Utils } from "../../../services/utils/utils.service";
import { userService } from "../../../services/api/user/user.service";
import { ChatUtils } from "../../../services/utils/chat-utils.service";
import { chatService } from "../../../services/api/chat/chat.service";
import MessageInput from "./message-input/MessageInput";
import MessageDisplay from "./message-display/MessageDisplay";
import {
  addToChatList,
  // setSelectedChatUser,
  toggleIsLoading,
  toggleMessageSent,
} from "../../../redux-toolkit/reducers/chat/chat.reducer";
// import { getConversationList } from "../../../redux-toolkit/api/chat";

/* const ChatWindow = () => {
  const { profile } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.chat);
  const chatList = useSelector((state) => state.chat.chatList);
  const [receiver, setReceiver] = useState();
  const [conversationId, setConversationId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  const receiverCheckListRef = useRef([]);

  const getChatMessages = useCallback(
    async (receiverId) => {
      try {
        const response = await chatService.getChatMessages(receiverId);
        ChatUtils.privateChatMessages = [...response.data.messages];
        setChatMessages([...ChatUtils.privateChatMessages]);
      } catch (error) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    },
    [dispatch]
  );

  const getNewUserMessages = useCallback(() => {
    if (searchParams.get("id") && searchParams.get("username")) {
      setConversationId("");
      setChatMessages([]);
      getChatMessages(searchParams.get("id"));
    }
  }, [getChatMessages, searchParams]);

  const getUserProfileByUserId = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUserId(
        searchParams.get("id")
      );
      setReceiver(response.data.user);
      ChatUtils.joinRoomEvent(response.data.user, profile);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [dispatch, profile, searchParams]);

  const sendChatMessage = async (message, gifUrl, selectedImage) => {
    try {
      const checkUserOne = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === profile?.username &&
          user?.userTwo === receiver?.username
      );
      const checkUserTwo = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === receiver?.username &&
          user?.userTwo === profile?.username
      );
      const messageData = ChatUtils.messageData({
        receiver,
        conversationId,
        message,
        searchParamsId: searchParams.get("id"),
        chatMessages,
        gifUrl,
        selectedImage,
        isRead: checkUserOne && checkUserTwo,
      });
      await chatService.saveChatMessage(messageData);
      console.log("sendChatMessage");

      if (
        !receiverCheckListRef.current.includes(receiver.username) &&
        !ChatUtils.checkUsername(receiver.username, chatList)
      ) {
        const response = await chatService.getChatMessages(
          searchParams.get("id")
        );
        const newMessage =
          response.data.messages[response.data.messages.length - 1];
        const newChatList = [newMessage, ...chatList];
        // const newChatList = [...chatList, newMessage];
        dispatch(addToChatList({ isLoading: true, chatList: newChatList }));
        getNewUserMessages();
        console.log("test");
        receiverCheckListRef.current = [
          ...receiverCheckListRef.current,
          receiver.username,
        ];
        // console.log("receiverCheckList u if bl. =", receiverCheckList);
        // receiverCheckList.push(receiver.username);
      }
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const updateMessageReaction = async (body) => {
    try {
      await chatService.updateMessageReaction(body);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const deleteChatMessage = async (senderId, receiverId, messageId, type) => {
    try {
      await chatService.markMessageAsDelete(
        messageId,
        senderId,
        receiverId,
        type
      );
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  useEffect(() => {
    if (rendered) {
      getUserProfileByUserId();
      getNewUserMessages();
    }
    if (!rendered) setRendered(true);
  }, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

  useEffect(() => {
    if (rendered) {
      ChatUtils.socketIOMessageReceived(
        dispatch,
        chatMessages,
        searchParams.get("username"),
        setConversationId,
        setChatMessages
      );
    }
    if (!rendered) setRendered(true);
    ChatUtils.usersOnline(setOnlineUsers);
    ChatUtils.usersOnChatPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, rendered]);

  useEffect(() => {
    ChatUtils.socketIOMessageReaction(
      chatMessages,
      searchParams.get("username"),
      setConversationId,
      setChatMessages
    );
  }, [chatMessages, searchParams]);

  const chatMessagesRedux = useSelector((state) => state.chat.chatMessages);
  console.log(chatMessagesRedux);
  // console.log(chatMessages);
  return (
    <div className="chat-window-container" data-testid="chatWindowContainer">
      {isLoading ? (
        <div className="message-loading" data-testid="message-loading"></div>
      ) : (
        <div data-testid="chatWindow">
          <div className="chat-title" data-testid="chat-title">
            {receiver && (
              <div className="chat-title-avatar">
                <Avatar
                  name={receiver?.username}
                  bgColor={receiver.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={receiver?.profilePicture}
                />
              </div>
            )}
            <div className="chat-title-items">
              <div
                className={`chat-name ${
                  Utils.checkIfUserIsOnline(receiver?.username, onlineUsers)
                    ? ""
                    : "user-not-online"
                }`}
              >
                {receiver?.username}
              </div>
              {Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) && (
                <span className="chat-active">Online</span>
              )}
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-window-message">
              <MessageDisplay
                chatMessages={chatMessages}
                profile={profile}
                updateMessageReaction={updateMessageReaction}
                deleteChatMessage={deleteChatMessage}
              />
            </div>
            <div className="chat-window-input">
              <MessageInput setChatMessage={sendChatMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatWindow; */

const ChatWindow = () => {
  // const messages = useSelector((state) => state.chat.chatMessages);
  const { profile } = useSelector((state) => state.user);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const chatList = useSelector((state) => state.chat.chatList);
  const [receiver, setReceiver] = useState();
  const [conversationId, setConversationId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  console.log("ChatWindow Rendered. ChatMessages:", chatMessages);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();
  const receiverCheckListRef = useRef([]);
  const counterRef = useRef(0);
  // console.log("counterRef:", counterRef);
  // console.log(receiverCheckListRef.current.length);

  const getChatMessages = useCallback(
    async (receiverId) => {
      try {
        const response = await chatService.getChatMessages(receiverId);
        ChatUtils.privateChatMessages = [...response.data.messages];
        setChatMessages([...ChatUtils.privateChatMessages]);
      } catch (error) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    },
    [dispatch]
  );

  const getNewUserMessages = useCallback(() => {
    if (searchParams.get("id") && searchParams.get("username")) {
      setConversationId("");
      setChatMessages([]);
      getChatMessages(searchParams.get("id"));
    }
  }, [getChatMessages, searchParams]);

  const getUserProfileByUserId = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUserId(
        searchParams.get("id")
      );
      setReceiver(response.data.user);
      ChatUtils.joinRoomEvent(response.data.user, profile);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  }, [dispatch, profile, searchParams]);

  const sendChatMessage = async (
    message,
    gifUrl,
    selectedImage
    // getUserMessages = getNewUserMessages
  ) => {
    try {
      dispatch(toggleMessageSent({ messageSent: true }));
      counterRef.current++;
      const checkUserOne = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === profile?.username &&
          user?.userTwo === receiver?.username
      );
      const checkUserTwo = some(
        ChatUtils.chatUsers,
        (user) =>
          user?.userOne === receiver?.username &&
          user?.userTwo === profile?.username
      );
      const messageData = ChatUtils.messageData({
        receiver,
        conversationId,
        message,
        searchParamsId: searchParams.get("id"),
        chatMessages,
        gifUrl,
        selectedImage,
        isRead: checkUserOne && checkUserTwo,
      });
      const response = await chatService.saveChatMessage(messageData);
      messageData.conversationId = response.data.conversationId;
      // dispatch(setSelectedChatUser({ isLoading: false, user: receiver }));
      if (
        !receiverCheckListRef.current.includes(receiver.username) &&
        !ChatUtils.checkUsername(receiver.username, chatList)
      ) {
        /* const response = await chatService.getChatMessages(
          searchParams.get("id")
        );
        const newMessage =
          response.data.messages[response.data.messages.length - 1];

        const newChatList = [newMessage, ...chatList];
        dispatch(addToChatList({ isLoading: true, chatList: newChatList }));
        dispatch(toggleIsLoading({ isLoading: false }));
        getNewUserMessages();
        console.log(isLoading); */

        // dispatch(getConversationList());
        // getUserMessages();
        console.log("ide");

        const response = await chatService.getChatMessages(
          searchParams.get("id")
        );
        const newMessage =
          response.data.messages[response.data.messages.length - 1];
        const newChatList = [newMessage, ...chatList];
        dispatch(addToChatList({ isLoading: true, chatList: newChatList }));
        dispatch(toggleIsLoading({ isLoading: false }));

        /* dispatch(getConversationList());
        getUserProfileByUserId();
        getNewUserMessages(); */

        // ChatUtils.privateChatMessages = [...response.data.messages];
        console.log(
          "sendChatMessage ChatUtils.privateChatMessages =",
          ChatUtils.privateChatMessages
        );

        /* const clonedPrivateChatMessages = JSON.parse(
          JSON.stringify(ChatUtils.privateChatMessages)
        ); */
        console.log("sendChatMessage chatMessages =", chatMessages);

        receiverCheckListRef.current = [
          ...receiverCheckListRef.current,
          receiver.username,
        ];
      }

      /* if (counterRef.current.length === 2) {
        const response = await chatService.getChatMessages(
          searchParams.get("id")
        );

        dispatch(
          addChatMessages({
            isLoading: true,
            chatMessages: response.data.messages,
          })
        );
        dispatch(toggleIsLoading({ isLoading: false }));
      } */
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const updateMessageReaction = async (body) => {
    try {
      await chatService.updateMessageReaction(body);
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  const deleteChatMessage = async (senderId, receiverId, messageId, type) => {
    try {
      await chatService.markMessageAsDelete(
        messageId,
        senderId,
        receiverId,
        type
      );
    } catch (error) {
      Utils.dispatchNotification(
        error.response.data.message,
        "error",
        dispatch
      );
    }
  };

  /* useEffect(() => {
    if (counterRef.current.length === 2) {
      setChatMessages(messages);
    }
  }, [messages]); */

  useEffect(() => {
    if (rendered) {
      getUserProfileByUserId();
      getNewUserMessages();
    }
    if (!rendered) setRendered(true);
  }, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

  useEffect(() => {
    if (rendered) {
      ChatUtils.socketIOMessageReceived(
        chatMessages,
        searchParams.get("username"),
        setConversationId,
        setChatMessages
      );
    }
    if (!rendered) setRendered(true);
    ChatUtils.usersOnline(setOnlineUsers);
    ChatUtils.usersOnChatPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, rendered]);

  useEffect(() => {
    ChatUtils.socketIOMessageReaction(
      chatMessages,
      searchParams.get("username"),
      setConversationId,
      setChatMessages
    );
  }, [chatMessages, searchParams]);

  return (
    <div className="chat-window-container" data-testid="chatWindowContainer">
      {isLoading ? (
        <div className="message-loading" data-testid="message-loading"></div>
      ) : (
        <div data-testid="chatWindow">
          <div className="chat-title" data-testid="chat-title">
            {receiver && (
              <div className="chat-title-avatar">
                <Avatar
                  name={receiver?.username}
                  bgColor={receiver.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={receiver?.profilePicture}
                />
              </div>
            )}
            <div className="chat-title-items">
              <div
                className={`chat-name ${
                  Utils.checkIfUserIsOnline(receiver?.username, onlineUsers)
                    ? ""
                    : "user-not-online"
                }`}
              >
                {receiver?.username}
              </div>
              {Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) && (
                <span className="chat-active">Online</span>
              )}
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-window-message">
              <MessageDisplay
                chatMessages={chatMessages}
                profile={profile}
                updateMessageReaction={updateMessageReaction}
                deleteChatMessage={deleteChatMessage}
              />
            </div>
            <div className="chat-window-input">
              <MessageInput setChatMessage={sendChatMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatWindow;
