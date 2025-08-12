import SideNav from "../components/app-comp/side-nav";
import "../styles/Home.css";

export const Home = () => {
  //const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
  return (
    <div className="page-container">
      <div
        style={{
          position: "fixed",
          backgroundImage: "url('logo-images/kuca.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          zIndex: "-1",
        }}
      ></div>

      <SideNav />

      <div className="base-container">
        <section className="game-section">
          <div className="chessboard-placeholder"></div>

          {/* Start Game and Play Against Bot Buttons */}
          <div className="game-buttons">
            <button className="play-button">Play Now</button>

            <button className="play-button">Play Bot</button>
          </div>

          {/* Show History Button */}
          <div className="history-button-container">
            <button
              className="play-button"
              style={{
                color: "White",
                background: "linear-gradient(135deg, #9b0000, #441d07)",
              }}
            >
              Show History
            </button>
          </div>
        </section>

        <section className="leaderboard-section">
          <h2
            style={{
              textShadow:
                "-1px 0 rgb(255, 255, 255), 0 1px rgb(255, 255, 255),1px 0 rgb(255, 255, 255), 0 -1px rgb(255, 255, 255)",
            }}
          >
            Leaderboard
          </h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>ELO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>ChessMaster123</td>
                <td>42</td>
                <td>10</td>
                <td>2100</td>
              </tr>
              <tr>
                <td>2</td>
                <td>QueenCrusher</td>
                <td>38</td>
                <td>15</td>
                <td>1980</td>
              </tr>
              {/* Map leaderboard data here dynamically */}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};
