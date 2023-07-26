import { useEffect, useCallback, useRef, useState } from "react";
import { cloneDeep } from "lodash";

import "./Toast.scss";
import { useDispatch } from "react-redux";
import { Utils } from "../../services/utils/utils.service";
import { notification } from "../../redux-toolkit/reducers/notifications/notification.reducer";

interface IToastProps {
  toastList?: notification[];
  position?: string;
  autoDelete?: boolean;
  autoDeleteTime?: number;
}

const Toast = (props: IToastProps) => {
  const { toastList = [], position, autoDelete, autoDeleteTime = 2000 } = props;
  const [list, setList] = useState(toastList);
  const listData = useRef<notification[]>([]);
  const dispatch = useDispatch();

  const deleteToast = useCallback(() => {
    listData.current = cloneDeep(list);
    if (listData.current !== undefined) {
      listData.current.splice(0, 1);
    }
    setList([...listData.current]);
    if (!listData.current.length && list) {
      list.length = 0;
      Utils.dispatchClearNotification(dispatch);
    }
  }, [list, dispatch]);

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  useEffect(() => {
    const tick = () => {
      deleteToast();
    };

    if (autoDelete && toastList.length && list.length) {
      const interval = setInterval(tick, autoDeleteTime);
      return () => clearInterval(interval);
    }
  }, [toastList, autoDelete, autoDeleteTime, list, deleteToast]);

  return (
    <div className={`toast-notification-container ${position}`}>
      {list.map((toast) => (
        <div
          data-testid="toast-notification"
          key={Utils.generateString(10)}
          className={`toast-notification toast ${position}`}
          style={{ backgroundColor: toast.backgroundColor }}
        >
          <button className="cancel-button" onClick={() => deleteToast()}>
            X
          </button>
          <div
            className={`toast-notification-image ${
              toast.description.length <= 73 ? "toast-icon" : ""
            }`}
          >
            <img src={toast.icon} alt="" />
          </div>
          <div
            className={`toast-notification-message ${
              toast.description.length <= 73 ? "toast-message" : ""
            }`}
          >
            {toast.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
