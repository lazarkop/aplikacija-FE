import { addUser } from 'src/redux-toolkit/reducers/user/user.reducer';
import { avatarColors } from 'src/services/utils/static.data';
import { floor, random } from 'lodash';

export class Utils {
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  static generateAvatar(text, backgroundColor, foregroundColor = 'white') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = 'normal 80px sans-serif';
    context.fillStyle = foregroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }

  static dispatchUser(result, pageReload, dispatch, setUser) {
    pageReload(true);
    dispatch(addUser({ token: result.data.token, profile: result.data.user }));
    setUser(result.data.user);
  }
}

/* import React from 'react';
import { addUser } from '@redux/reducers/user/user.reducer';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { avatarColors } from '@services/utils/static.data';
import { AxiosResponse } from 'axios';
import { floor, random } from 'lodash';

interface IDispatchUserArgs {
  result: AxiosResponse<any, any>;
  pageReload: (newValue: string | boolean) => void;
  dispatch: Dispatch<AnyAction>;
  setUser: React.Dispatch<React.SetStateAction<undefined>>;
}

export class Utils {
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  static generateAvatar(
    text: string,
    backgroundColor: string,
    foregroundColor = 'white'
  ) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

    if (context !== null) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      context.font = 'normal 80px sans-serif';
      context.fillStyle = foregroundColor;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    } else {
      console.error('context is null');
    }

    return canvas.toDataURL('image/png');
  }

  static dispatchUser(args: IDispatchUserArgs) {
    args.pageReload(true);
    args.dispatch(
      addUser({ token: args.result.data.token, profile: args.result.data.user })
    );
    args.setUser(args.result.data.user);
  }
} */
