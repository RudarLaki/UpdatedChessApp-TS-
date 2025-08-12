import "../../styles/Home.css";
export default function SideNav() {
  return (
    <div className="base-sidebar">
      <div className="sidebar-icon play-game" title="Play Game">
        <i className="fas fa-chess"></i>
      </div>
      <div className="sidebar-icon friends-icon" title="Friends">
        <i className="fas fa-user-friends"></i>
      </div>
      <div className="sidebar-icon message-icon" title="Messages">
        <i className="fas fa-envelope"></i>
        <span className="notification-badge">2</span>{" "}
      </div>

      <div className="sidebar-icon puzzles-icon" title="Puzzles">
        <i className="fas fa-brain"></i>
      </div>
      <div className="sidebar-icon history-icon" title="History">
        <i className="fas fa-history"></i>
      </div>
      <div className="sidebar-icon notifications-icon" title="Notifications">
        <i className="fas fa-bell"></i>
        <span className="notification-badge">3</span>{" "}
      </div>
      <div className="sidebar-icon leaderboard-icon" title="Leaderboard">
        <i className="fas fa-trophy"></i>
      </div>
      <div className="sidebar-icon profile-icon" title="Profile">
        <i className="fas fa-user-circle"></i>
      </div>
    </div>
  );
}
