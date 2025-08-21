const API_URL = "http://51.20.64.148:3000/auth";
import {
  type LoginRequest,
  type RegisterRequest,
} from "../../../sharedGameLogic/types/auth";

interface AuthResponse {
  email: string;
  userName: string;
  token: string;
}
class AuthService {
  register = async (
    registerRequest: RegisterRequest
  ): Promise<AuthResponse> => {
    const res = await fetch(API_URL + `/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerRequest),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    return res.json();
  };

  login = async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginRequest),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }
    return res.json();
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
