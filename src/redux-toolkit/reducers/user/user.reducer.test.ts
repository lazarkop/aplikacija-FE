import { existingUser } from '../../../mocks/data/user.mock';
import reducer, {
  IUserState,
  addUser,
  clearUser,
  updateUserProfile,
} from './user.reducer';

const initialState: IUserState = {
  token: '',
  profile: null,
};

describe('user reducer', () => {
  beforeEach(() => {
    initialState.token = '';
    initialState.profile = null;
  });

  it('should return the initial state', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(reducer(undefined, {} as any)).toEqual({ token: '', profile: null });
  });

  it('should add user with token and profile', () => {
    expect(
      reducer(
        initialState,
        addUser({ token: '1234', profile: { username: 'manny' } })
      )
    ).toEqual({
      token: '1234',
      profile: { username: 'manny' },
    });
  });

  it('should update user profile', () => {
    initialState.token = '123456';
    initialState.profile = existingUser;
    expect(
      reducer(initialState, updateUserProfile({ username: 'Sunny' }))
    ).toEqual({
      token: '123456',
      profile: { username: 'Sunny' },
    });
  });

  it('should reset profile and token', () => {
    initialState.token = '123456';
    initialState.profile = existingUser;
    expect(reducer(initialState, clearUser())).toEqual({
      token: '',
      profile: null,
    });
  });
});
