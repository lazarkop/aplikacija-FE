import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user/user.reducer';
import suggestionsReducer from './reducers/suggestions/suggestions.reducer';
import notificationReducer from './reducers/notifications/notification.reducer';
import chatReducer from './reducers/chat/chat.reducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer,
    notifications: notificationReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
