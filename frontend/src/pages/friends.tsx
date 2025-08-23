import { userService } from "../services/user-service";
import type { User } from "../types/User";
import { useState, useEffect } from "react";
import "../styles/Friends.css";
import "../styles/Home.css";
//import { FaUserCircle } from "react-icons/fa"; // example icon

type Friend = {
  id: string;
  userId1: string;
  userId2: string;
  status: string;
  sentAt: string;
};

const FriendsPage = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const userId = JSON.parse(localStorage.getItem("loginInfo")!).id;

  // Fetch all friends on load
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const res = await userService.getFriends(userId);

        if (!res || !res.friends) return;

        const friendIds = res.friends.map((f: Friend) => {
          return f.userId1 === userId ? f.userId2 : f.userId1;
        });

        const profiles = await Promise.all(
          friendIds.map(async (fid: string) => {
            const res = await userService.getProfile(fid);
            return res.user; // extract the actual user object
          })
        );

        setFriends(profiles);
        console.log(profiles);
      } catch (err) {
        console.error("Error loading friends", err);
      }
    };

    loadFriends();
  }, [userId]);

  const handleSearch = (q: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      if (!q) {
        setSearchResults([]);
        setLoadingSearch(false);
        return;
      }

      setLoadingSearch(true);
      try {
        const res = await fetch(`/api/users?search=${q}`);
        const data: User[] = await res.json();
        // Exclude already friends
        const filtered = data.filter(
          (u) => !friends.some((f) => f.id === u.id)
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSearch(false);
      }
    }, 300); // debounce 300ms

    setDebounceTimer(timer);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const addFriend = async (friendId: string) => {
    try {
      userService.addFriend(userId, friendId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="friends-container">
      <h3>Add New Friends</h3>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="search-input"
      />

      {loadingSearch && <p>Searching...</p>}

      <div className="search-results">
        {searchResults.map((user) => (
          <div className="search-item" key={user.id}>
            <span>{user.userName}</span>
            <button className="add-btn" onClick={() => addFriend(user.id)}>
              Add
            </button>
          </div>
        ))}
      </div>

      <h2>My Friends</h2>

      {friends.length === 0 ? (
        <p>No friends yet.</p>
      ) : (
        <div className="friends-grid">
          {friends.map((friend) => (
            <div className="friend-card" key={friend.id}>
              <div className="sidebar-icon profile-icon" title="Profile">
                <i
                  className="fas fa-user-circle"
                  style={{ color: "black" }}
                  //onClick={() => handleClick("profile")}
                ></i>
              </div>
              <div className="friend-name">{friend.userName}</div>
              <div className="friend-elo">ELO: {friend.elo}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
