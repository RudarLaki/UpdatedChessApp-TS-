const API_URL = "/auth";
// const API_URL = "http://localhost:3000/auth";

import {
  type LoginRequest,
  type RegisterRequest,
} from "../../../sharedGameLogic/types/auth";
import axios from "axios";

interface AuthResponse {
  email: string;
  userName: string;
  token: string;
}
class AuthService {
  register = async (
    registerRequest: RegisterRequest
  ): Promise<AuthResponse> => {
    try {
      const res = await axios.post(API_URL + `/register`, registerRequest);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed starting game");
    }
  };

  login = async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    try {
      const res = await axios.post(`${API_URL}/login`, loginRequest);
      return res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed starting game");
    }
  };

  saveToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  logout = () => {
    localStorage.removeItem("token");
  };
}

export const authService = new AuthService();
