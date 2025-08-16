import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";
const SideNav = () => {
  const navigate = useNavigate();

  const handleClick = (functionName: string) => {
    switch (functionName) {
      case "home":
        console.log("Navigating to Home");
        navigate("/home");
        break;
      case "game":
        console.log("Navigating to game");
        navigate("/game");
        break;
      case "leaderboard":
        console.log("Navigating to leaderboard");
        break;
      case "friends":
        console.log("Navigating to friends");
        break;
      case "notifications":
        console.log("Navigating to mails");
        break;
      case "puzzle":
        console.log("Opening Puzzle");
        break;
      case "profile":
        console.log("Opening Profile");
        break;
      default:
        console.log("Unknown function:", functionName);
    }
  };

  return (
    <div className="base-sidebar">
      <div className="sidebar-icon play-game" title="Play Game">
        <i className="fas fa-chess" onClick={() => handleClick("game")}></i>
      </div>
      <div className="sidebar-icon friends-icon" title="Friends">
        <i
          className="fas fa-user-friends"
          onClick={() => handleClick("friends")}
        ></i>
      </div>
      <div className="sidebar-icon message-icon" title="Messages">
        <i
          className="fas fa-envelope"
          onClick={() => handleClick("notifications")}
        ></i>
        <span className="notification-badge">2</span>{" "}
      </div>

      <div className="sidebar-icon puzzles-icon" title="Puzzles">
        <i className="fas fa-brain" onClick={() => handleClick("puzzle")}></i>
      </div>
      <div className="sidebar-icon history-icon" title="History">
        <i
          className="fas fa-history"
          onClick={() => handleClick("history")}
        ></i>
      </div>
      <div className="sidebar-icon notifications-icon" title="Notifications">
        <i
          className="fas fa-bell"
          onClick={() => handleClick("notifications")}
        ></i>
        <span className="notification-badge">3</span>{" "}
      </div>
      <div className="sidebar-icon leaderboard-icon" title="Leaderboard">
        <i
          className="fas fa-trophy"
          onClick={() => handleClick("leaderboard")}
        ></i>
      </div>
      <div className="sidebar-icon profile-icon" title="Profile">
        <i
          className="fas fa-user-circle"
          onClick={() => handleClick("profile")}
        ></i>
      </div>
    </div>
  );
};
export default SideNav;
