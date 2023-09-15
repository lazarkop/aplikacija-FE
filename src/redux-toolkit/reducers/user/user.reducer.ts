import { createSlice } from '@reduxjs/toolkit';
import { ObjectId } from 'mongodb';
import { ObjectId as mongooseObjectId } from 'mongoose';

interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}
interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface IUserDocument {
  _id: string;
  authId: string | ObjectId;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: mongooseObjectId[];
  blockedBy: mongooseObjectId[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  createdAt?: Date;
}

export interface IUserState {
  token: string;
  profile: null | IUserDocument;
}

const initialState: IUserState = {
  token: '',
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
    },
    clearUser: (state) => {
      state.token = '';
      state.profile = null;
    },
    updateUserProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { addUser, clearUser, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
