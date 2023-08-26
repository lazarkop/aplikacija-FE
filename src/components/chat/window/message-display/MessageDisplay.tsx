/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import PropTypes from "prop-types";
import "./MessageDisplay.scss";
import { useRef, useState } from "react";
import useChatScrollToBottom from "../../../../hooks/useChatScrollToBottom";
import { Utils } from "../../../../services/utils/utils.service";
import { timeAgo } from "../../../../services/utils/timeago.utils";
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick";
import ImageModal from "../../../image-modal/ImageModal";
import Dialog from "../../../dialog/Dialog";
import RightMessageDisplay from "./right-message-display/RightMessageDisplay";
import LeftMessageDisplay from "./left-message/LeftMessageDisplay";
import { ChatUtils } from "../../../../services/utils/chat-utils.service";
import { useDispatch, useSelector } from "react-redux";
import {
  changeReceiverId,
  toggleMessageSent,
} from "../../../../redux-toolkit/reducers/chat/chat.reducer";
import { useSearchParams } from "react-router-dom";
// import useEffectOnce from "../../../../hooks/useEffectOnce";
// import { chatService } from "../../../../services/api/chat/chat.service";

const MessageDisplay = ({
  chatMessages,
  profile,
  updateMessageReaction,
  deleteChatMessage,
}) => {
  console.log("MessageDisplay chatMessages = ", chatMessages);

  const [imageUrl, setImageUrl] = useState("");
  const [showReactionIcon, setShowReactionIcon] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    message: null,
    type: "",
  });
  const [activeElementIndex, setActiveElementIndex] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const reactionRef = useRef(null);
  const [toggleReaction, setToggleReaction] = useDetectOutsideClick(
    reactionRef,
    false
  );
  const dispatch = useDispatch();
  const receiverId = useSelector((state) => state.chat.receiverId);
  const messageSent = useSelector((state) => state.chat.messageSent);
  const [searchParams] = useSearchParams();
  const receiverIdParam = searchParams.get("id");
  const oneMessageRef = useRef([]);
  const newChatMessagesRef = useRef([]);
  const changedReceiverRef = useRef();
  // let messageSentRef = useRef();

  let cleanedChatMessages = [];

  if (
    chatMessages &&
    chatMessages.length > 0 &&
    chatMessages[0].receiverId === receiverIdParam
  ) {
    cleanedChatMessages = ChatUtils.removeDuplicates(chatMessages);
  }

  // if chatMessages.receiverId !== receiverIdParam and messageSent === true reset chatMessages
  if (
    chatMessages &&
    chatMessages.length > 0 &&
    chatMessages[0].receiverId !== receiverIdParam &&
    messageSent === true
  ) {
    oneMessageRef.current = [];
    newChatMessagesRef.current = [];
    dispatch(toggleMessageSent({ messageSent: false }));
  }

  //
  if (
    cleanedChatMessages.length === 1 &&
    messageSent === false &&
    changedReceiverRef.current === true
  ) {
    oneMessageRef.current.push(cleanedChatMessages[0]);
    oneMessageRef.current = ChatUtils.removeDuplicates(oneMessageRef.current);
    const clonedOneMessageRef = JSON.parse(
      JSON.stringify(oneMessageRef.current)
    );
    if (
      !ChatUtils.containsObjectWithId(
        newChatMessagesRef.current,
        cleanedChatMessages[0]
      )
    ) {
      dispatch(toggleMessageSent({ messageSent: false }));
    }
    newChatMessagesRef.current = clonedOneMessageRef;
  } else if (cleanedChatMessages.length === 1 && messageSent === true) {
    changedReceiverRef.current = false;
    oneMessageRef.current.push(cleanedChatMessages[0]);
    oneMessageRef.current = ChatUtils.removeDuplicates(oneMessageRef.current);
    const clonedOneMessageRef = JSON.parse(
      JSON.stringify(oneMessageRef.current)
    );
    if (
      !ChatUtils.containsObjectWithId(
        newChatMessagesRef.current,
        cleanedChatMessages[0]
      )
    ) {
      dispatch(toggleMessageSent({ messageSent: false }));
    }
    newChatMessagesRef.current = clonedOneMessageRef;
  } else if (cleanedChatMessages.length > 1) {
    if (messageSent === true) {
      newChatMessagesRef.current.push(
        cleanedChatMessages[cleanedChatMessages.length - 1]
      );
      dispatch(toggleMessageSent({ messageSent: false }));
    }
    if (messageSent === false) {
      const clonedCleanedChatMessages = JSON.parse(
        JSON.stringify(cleanedChatMessages)
      );
      newChatMessagesRef.current = clonedCleanedChatMessages;
    }
  } else if (cleanedChatMessages.length === 0) {
    oneMessageRef.current = [];
    newChatMessagesRef.current = [];
  }

  // changeReceiver
  if (receiverId !== receiverIdParam) {
    dispatch(changeReceiverId({ receiverId: receiverIdParam }));
    // if chatMessages.receiverId !== receiverIdParam reset chatMessages
    changedReceiverRef.current = true;
    oneMessageRef.current = [];
    newChatMessagesRef.current = [];
    cleanedChatMessages = [];
  }

  console.log("Ref = ", oneMessageRef.current);

  // messageSent.current = chatMessages;

  /* if (receiverId !== receiverIdParam) {
    dispatch(changeReceiverId({ receiverId: receiverIdParam }));
    // if chatMessages.receiverId !== receiverIdParam reset chatMessages
    oneMessageRef.current = [];
  }
  let newChatMessages;
  const cleanedChatMessages = ChatUtils.removeDuplicates(chatMessages);

  if (cleanedChatMessages.length === 1) {
    oneMessageRef.current.push(cleanedChatMessages[0]);
    oneMessageRef.current = ChatUtils.removeDuplicates(oneMessageRef.current);
    newChatMessages = ChatUtils.removeDuplicates(oneMessageRef.current);
  } else {
    newChatMessages = cleanedChatMessages;
  }
 */
  /*  useEffect(() => {
    if (receiverId !== receiverIdParam) {
      dispatch(changeReceiverId({ receiverId: receiverIdParam }));
      oneMessageRef.current = [];
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cleanedChatMessages = [];
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chatMessages = [];
    }
  }, [dispatch, receiverId, receiverIdParam]); */

  console.log("newChatMessages = ", newChatMessagesRef.current);

  // eslint-disable-next-line spaced-comment
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const scrollRef = useChatScrollToBottom(newChatMessagesRef.current);

  const showReactionIconOnHover = (show, index) => {
    if (index === activeElementIndex || !activeElementIndex) {
      setShowReactionIcon(show);
    }
  };

  const handleReactionClick = (body) => {
    updateMessageReaction(body);
    setSelectedReaction(null);
  };

  const deleteMessage = (message, type) => {
    setDeleteDialog({
      open: true,
      message,
      type,
    });
  };

  /*  useEffect(() => {
    changedReceiverRef.current = true;
  }, []); */

  return (
    <>
      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      )}
      {selectedReaction && (
        <Dialog
          title="Do you want to remove your reaction?"
          showButtons={true}
          firstButtonText="Remove"
          secondButtonText="Cancel"
          firstBtnHandler={() => handleReactionClick(selectedReaction)}
          secondBtnHandler={() => setSelectedReaction(null)}
        />
      )}
      {deleteDialog.open && (
        <Dialog
          title="Delete message?"
          showButtons={true}
          firstButtonText={`${
            deleteDialog.type === "deleteForMe"
              ? "DELETE FOR ME"
              : "DELETE FOR EVERYONE"
          }`}
          secondButtonText="CANCEL"
          firstBtnHandler={() => {
            const { message, type } = deleteDialog;
            deleteChatMessage(
              message.senderId,
              message.receiverId,
              message._id,
              type
            );
            setDeleteDialog({
              open: false,
              message: null,
              type: "",
            });
          }}
          secondBtnHandler={() => {
            setDeleteDialog({
              open: false,
              message: null,
              type: "",
            });
          }}
        />
      )}
      <div className="message-page" ref={scrollRef} data-testid="message-page">
        {newChatMessagesRef.current.map((chat, index) => (
          <div
            key={Utils.generateString(10)}
            className="message-chat"
            data-testid="message-chat"
          >
            {(index === 0 ||
              timeAgo.dayMonthYear(chat.createdAt) !==
                timeAgo.dayMonthYear(
                  newChatMessagesRef.current[index - 1].createdAt
                )) && (
              <div className="message-date-group">
                <div
                  className="message-chat-date"
                  data-testid="message-chat-date"
                >
                  {timeAgo.chatMessageTransform(chat.createdAt)}
                </div>
              </div>
            )}
            {(chat.receiverUsername === profile?.username ||
              chat.senderUsername === profile?.username) && (
              <>
                {chat.senderUsername === profile?.username && (
                  <RightMessageDisplay
                    chat={chat}
                    lastChatMessage={
                      newChatMessagesRef.current[
                        newChatMessagesRef.current.length - 1
                      ]
                    }
                    profile={profile}
                    toggleReaction={toggleReaction}
                    showReactionIcon={showReactionIcon}
                    index={index}
                    activeElementIndex={activeElementIndex}
                    reactionRef={reactionRef}
                    setToggleReaction={setToggleReaction}
                    handleReactionClick={handleReactionClick}
                    deleteMessage={deleteMessage}
                    showReactionIconOnHover={showReactionIconOnHover}
                    setActiveElementIndex={setActiveElementIndex}
                    setShowImageModal={setShowImageModal}
                    setImageUrl={setImageUrl}
                    showImageModal={showImageModal}
                    setSelectedReaction={setSelectedReaction}
                  />
                )}

                {chat.receiverUsername === profile?.username && (
                  <LeftMessageDisplay
                    chat={chat}
                    profile={profile}
                    toggleReaction={toggleReaction}
                    showReactionIcon={showReactionIcon}
                    index={index}
                    activeElementIndex={activeElementIndex}
                    reactionRef={reactionRef}
                    setToggleReaction={setToggleReaction}
                    handleReactionClick={handleReactionClick}
                    deleteMessage={deleteMessage}
                    showReactionIconOnHover={showReactionIconOnHover}
                    setActiveElementIndex={setActiveElementIndex}
                    setShowImageModal={setShowImageModal}
                    setImageUrl={setImageUrl}
                    showImageModal={showImageModal}
                    setSelectedReaction={setSelectedReaction}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

MessageDisplay.propTypes = {
  chatMessages: PropTypes.array,
  profile: PropTypes.object,
  updateMessageReaction: PropTypes.func,
  deleteChatMessage: PropTypes.func,
};

export default MessageDisplay;

/* const MessageDisplay = ({
  chatMessages,
  profile,
  updateMessageReaction,
  deleteChatMessage,
}) => {
  console.log("MESSAGE DISPLAYs chatMessages =", chatMessages);
  const [imageUrl, setImageUrl] = useState("");
  const [showReactionIcon, setShowReactionIcon] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    message: null,
    type: "",
  });
  const [activeElementIndex, setActiveElementIndex] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const reactionRef = useRef(null);
  const [toggleReaction, setToggleReaction] = useDetectOutsideClick(
    reactionRef,
    false
  );
  const scrollRef = useChatScrollToBottom(chatMessages);

  const showReactionIconOnHover = (show, index) => {
    if (index === activeElementIndex || !activeElementIndex) {
      setShowReactionIcon(show);
    }
  };

  const handleReactionClick = (body) => {
    updateMessageReaction(body);
    setSelectedReaction(null);
  };

  const deleteMessage = (message, type) => {
    setDeleteDialog({
      open: true,
      message,
      type,
    });
  };

  return (
    <>
      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      )}
      {selectedReaction && (
        <Dialog
          title="Do you want to remove your reaction?"
          showButtons={true}
          firstButtonText="Remove"
          secondButtonText="Cancel"
          firstBtnHandler={() => handleReactionClick(selectedReaction)}
          secondBtnHandler={() => setSelectedReaction(null)}
        />
      )}
      {deleteDialog.open && (
        <Dialog
          title="Delete message?"
          showButtons={true}
          firstButtonText={`${
            deleteDialog.type === "deleteForMe"
              ? "DELETE FOR ME"
              : "DELETE FOR EVERYONE"
          }`}
          secondButtonText="CANCEL"
          firstBtnHandler={() => {
            const { message, type } = deleteDialog;
            deleteChatMessage(
              message.senderId,
              message.receiverId,
              message._id,
              type
            );
            setDeleteDialog({
              open: false,
              message: null,
              type: "",
            });
          }}
          secondBtnHandler={() => {
            setDeleteDialog({
              open: false,
              message: null,
              type: "",
            });
          }}
        />
      )}
      <div className="message-page" ref={scrollRef} data-testid="message-page">
        {chatMessages.map((chat, index) => (
          <div
            key={Utils.generateString(10)}
            className="message-chat"
            data-testid="message-chat"
          >
            {(index === 0 ||
              timeAgo.dayMonthYear(chat.createdAt) !==
                timeAgo.dayMonthYear(chatMessages[index - 1].createdAt)) && (
              <div className="message-date-group">
                <div
                  className="message-chat-date"
                  data-testid="message-chat-date"
                >
                  {timeAgo.chatMessageTransform(chat.createdAt)}
                </div>
              </div>
            )}
            {(chat.receiverUsername === profile?.username ||
              chat.senderUsername === profile?.username) && (
              <>
                {chat.senderUsername === profile?.username && (
                  <RightMessageDisplay
                    chat={chat}
                    lastChatMessage={chatMessages[chatMessages.length - 1]}
                    profile={profile}
                    toggleReaction={toggleReaction}
                    showReactionIcon={showReactionIcon}
                    index={index}
                    activeElementIndex={activeElementIndex}
                    reactionRef={reactionRef}
                    setToggleReaction={setToggleReaction}
                    handleReactionClick={handleReactionClick}
                    deleteMessage={deleteMessage}
                    showReactionIconOnHover={showReactionIconOnHover}
                    setActiveElementIndex={setActiveElementIndex}
                    setShowImageModal={setShowImageModal}
                    setImageUrl={setImageUrl}
                    showImageModal={showImageModal}
                    setSelectedReaction={setSelectedReaction}
                  />
                )}

                {chat.receiverUsername === profile?.username && (
                  <LeftMessageDisplay
                    chat={chat}
                    profile={profile}
                    toggleReaction={toggleReaction}
                    showReactionIcon={showReactionIcon}
                    index={index}
                    activeElementIndex={activeElementIndex}
                    reactionRef={reactionRef}
                    setToggleReaction={setToggleReaction}
                    handleReactionClick={handleReactionClick}
                    deleteMessage={deleteMessage}
                    showReactionIconOnHover={showReactionIconOnHover}
                    setActiveElementIndex={setActiveElementIndex}
                    setShowImageModal={setShowImageModal}
                    setImageUrl={setImageUrl}
                    showImageModal={showImageModal}
                    setSelectedReaction={setSelectedReaction}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

MessageDisplay.propTypes = {
  chatMessages: PropTypes.array,
  profile: PropTypes.object,
  updateMessageReaction: PropTypes.func,
  deleteChatMessage: PropTypes.func,
};

export default MessageDisplay;
 */
