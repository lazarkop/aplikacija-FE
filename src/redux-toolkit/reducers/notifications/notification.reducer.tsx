/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import checkIcon from "../../../assets/images/check.svg";
import errorIcon from "../../../assets/images/error.svg";
import infoIcon from "../../../assets/images/info.svg";
import warningIcon from "../../../assets/images/warning.svg";
import { cloneDeep, uniqBy } from "lodash";

export type notification = {
  id: number;
  description: string;
  type: string;
  icon: string;
  backgroundColor: string;
};

const initialState: notification[] = [];
let list: notification[] = [];

const toastIcons = [
  { success: checkIcon, color: "#5cb85c" },
  { error: errorIcon, color: "#d9534f" },
  { info: infoIcon, color: "#5bc0de" },
  { warning: warningIcon, color: "#f0ad4e" },
];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{ message: string; type: string }>
    ) => {
      const { message, type } = action.payload;
      const toast = toastIcons.find(
        (toast) => toast[type as keyof typeof toast]
      );
      const toastItem: notification = {
        id: state.length,
        description: message,
        type,
        icon: toast![type as keyof typeof toast],
        backgroundColor: toast!.color,
      };
      list = cloneDeep(list);
      if (toastItem) {
        list.unshift(toastItem);
      }
      list = [...uniqBy(list, "description")];
      return list;
    },
    clearNotification: () => {
      list = [];
      return [];
    },
  },
});

export const { addNotification, clearNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
