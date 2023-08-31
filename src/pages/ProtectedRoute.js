import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import useSessionStorage from '../hooks/useSessionStorage';
import { userService } from '../services/api/user/user.service';
import { addUser } from '../redux-toolkit/reducers/user/user.reducer';
import { Utils } from '../services/utils/utils.service';
import useEffectOnce from '../hooks/useEffectOnce';
import { useAppDispatch } from '../hooks/useAppDispatch';
// import { RootState } from '../redux-toolkit/store';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { profile, token } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const pageReload = useSessionStorage('pageReload', 'get');
  const deleteStorageUsername = useLocalStorage('username', 'delete');
  const setLoggedIn = useLocalStorage('keepLoggedIn', 'set');
  const deleteSessionPageReload = useSessionStorage('pageReload', 'delete');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    try {
      const response = await userService.checkCurrentUser();
      setUserData(response.data.user);
      setTokenIsValid(true);
      dispatch(
        addUser({ token: response.data.token, profile: response.data.user })
      );
    } catch (error) {
      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore({
          dispatch,
          deleteStorageUsername,
          deleteSessionPageReload,
          setLoggedIn,
        });
        await userService.logoutUser();
        navigate('/');
      }, 1000);
    }
  }, [
    dispatch,
    navigate,
    deleteStorageUsername,
    deleteSessionPageReload,
    setLoggedIn,
  ]);

  useEffectOnce(() => {
    checkUser();
  });

  if (
    keepLoggedIn ||
    (!keepLoggedIn && userData) ||
    (profile && token) ||
    pageReload
  ) {
    if (!tokenIsValid) {
      return <></>;
    } else {
      return <>{children}</>;
    }
  } else {
    return <>{<Navigate to="/" />}</>;
  }
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
