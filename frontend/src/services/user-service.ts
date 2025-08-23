const API_URL = "http://localhost:3000/user/";

class UserService {
  getProfile = async (id: string) => {
    const res = await fetch(`${API_URL}profile/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed getting user");
    }
    return res.json();
  };

  getFriends = async (id: string) => {
    const res = await fetch(`${API_URL}friends/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed getting user's friends");
    }
    return res.json();
  };

  addFriend = async (userId: string, friendId: string) => {
    const res = await fetch(`${API_URL}add-friend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, friendId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed adding friend");
    }
    return res.json();
  };
}

export const userService = new UserService();
