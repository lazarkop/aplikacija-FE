import { getUserSuggestions } from "../../api/suggestion";
import { createSlice } from "@reduxjs/toolkit";
import { IUserDocument } from "../user/user.reducer";

interface ISuggestionsState {
  users: IUserDocument[];
  isLoading: boolean;
}

const initialState: ISuggestionsState = {
  users: [],
  isLoading: false,
};

const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    addToSuggestions: (state, action) => {
      const { isLoading, users } = action.payload;
      state.users = [...users];
      state.isLoading = isLoading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserSuggestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserSuggestions.fulfilled, (state, action) => {
      state.isLoading = false;
      const { users } = action.payload;
      state.users = [...users];
    });
    builder.addCase(getUserSuggestions.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { addToSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
