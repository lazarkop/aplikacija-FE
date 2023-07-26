import { createAsyncThunk } from '@reduxjs/toolkit';
import { Utils } from '../../services/utils/utils.service';
import { chatService } from '../../services/api/chat/chat.service';
import axios from 'axios';

const getConversationList = createAsyncThunk(
  'chat/getUserChatList',
  async (name, { dispatch }) => {
    try {
      const response = await chatService.getConversationList();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          'error',
          dispatch
        );
      } else {
        console.error(error);
      }
    }
  }
);

export { getConversationList };
