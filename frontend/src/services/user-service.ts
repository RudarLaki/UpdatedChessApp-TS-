import api from "../context/apiJWT";

const API_URL = "/user/";
// const API_URL = "http://localhost:3000/user/";

class UserService {
  getProfile = async (id: string) => {
    try {
      const res = await api.get(`${API_URL}profile/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error in requestGameState:", err);
      throw err;
    }
  };

  getFriends = async (id: string) => {
    try {
      const res = await api.get(`${API_URL}friends/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error in requestGameState:", err);
      throw err;
    }
  };

  addFriend = async (userId: string, friendId: string) => {
    try {
      const res = await api.post(`${API_URL}add-friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendId }),
      });
      return res.data;
    } catch (err) {
      console.error("Error in requestGameState:", err);
      throw err;
    }
  };
}

export const userService = new UserService();
