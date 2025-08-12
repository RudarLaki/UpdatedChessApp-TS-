const API_URL = "http://localhost:3000/auth";

interface AuthResponse {
  email: string;
  userName: string;
  token: string;
}
export class AuthService {
  register = async (
    name: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lastName, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    return res.json();
  };

  login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
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
