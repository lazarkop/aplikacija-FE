import axios from '../../axios';

interface ISignInRequest {
  password: string;
  username: string;
}

interface ISignUpRequest extends ISignInRequest {
  email: string;
  avatarColor: string;
  avatarImage: string;
}

interface IResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

class AuthService {
  async signUp(body: ISignUpRequest) {
    const response = await axios.post('/signup', body);
    return response;
  }

  async signIn(body: ISignInRequest) {
    const response = await axios.post('/signin', body);
    return response;
  }

  async forgotPassword(email: string) {
    const response = await axios.post('/forgot-password', { email });
    return response;
  }

  async resetPassword(token: string, body: IResetPasswordRequest) {
    const response = await axios.post(`/reset-password/${token}`, body);
    return response;
  }
}

export const authService = new AuthService();
