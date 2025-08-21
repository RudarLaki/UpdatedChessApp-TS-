const API_URL = "http://13.61.15.90:3000/user/";

class UserService {
  getProfile = async (id: number) => {
    const res = await fetch(`${API_URL}/profile:${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed getting user");
    }

    return res.json();
  };

  getFriends = async (id: number) => {
    const res = await fetch(`${API_URL}friends:${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed getting user's friends");
    }

    return res.json();
  };
}
export const userService = new UserService();
