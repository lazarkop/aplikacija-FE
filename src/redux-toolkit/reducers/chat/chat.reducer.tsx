/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { getConversationList } from "../../api/chat";
import { createSlice } from "@reduxjs/toolkit";
import { orderBy } from "lodash";

const initialState = {
  chatList: [],
  selectedChatUser: null,
  isLoading: false,
  chatMessages: [],
  receiverId: "",
  messageSent: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleMessageSent: (state, action) => {
      const { messageSent } = action.payload;
      state.messageSent = messageSent;
    },
    changeReceiverId: (state, action) => {
      const { receiverId } = action.payload;
      state.receiverId = receiverId;
    },
    toggleIsLoading: (state, action) => {
      const { isLoading } = action.payload;
      state.isLoading = isLoading;
    },
    addChatMessages: (state, action) => {
      const { isLoading, chatMessages } = action.payload;
      state.chatMessages = [...chatMessages];
      state.isLoading = isLoading;
    },
    addToChatList: (state, action) => {
      const { isLoading, chatList } = action.payload;
      state.chatList = [...chatList];
      state.isLoading = isLoading;
    },
    setSelectedChatUser: (state, action) => {
      const { isLoading, user } = action.payload;
      state.selectedChatUser = user;
      state.isLoading = isLoading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConversationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {
      const { list } = action.payload;
      state.isLoading = false;
      const sortedList = orderBy(list, ["createdAt"], ["desc"]);
      state.chatList = [...sortedList];
    });
    builder.addCase(getConversationList.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  addToChatList,
  setSelectedChatUser,
  addChatMessages,
  toggleIsLoading,
  changeReceiverId,
  toggleMessageSent,
} = chatSlice.actions;
export default chatSlice.reducer;
