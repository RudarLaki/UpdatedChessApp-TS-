import "../styles/GameScreen.css";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SideNav from "../components/app-comp/side-nav";
import MyTimer from "../components/app-comp/Timer";
import MoveHistory from "../components/app-comp/MoveHistory";
import ChessBoard from "../components/chess-comp/ChessBoard";
import PieceComp from "../components/chess-comp/Piece";
import Piece from "../../../sharedGameLogic/pieceLogic/Piece";

import type { Move } from "../../../sharedGameLogic/boardLogic/moveLogic/Move";
import { socketService } from "../services/socket-service";
// import { gameService } from "../services/game-service";

const myMap = new Map<string, number>();
myMap.set("P", 1);
myMap.set("N", 3);
myMap.set("B", 3.5);
myMap.set("R", 5);
myMap.set("Q", 9);

type GameNavState = {
  time: number;
  addition: number;
};

const GameScreen = () => {
  const { state } = useLocation() as { state: GameNavState | null };
  const addition = state?.addition ?? 0;
  const matchTime = (state?.time ?? 6) * 60;

  const navigate = useNavigate();
  const [whiteEatenPieces, setWhiteEatenPieces] = useState<Piece[]>([]);
  const [blackEatenPieces, setBlackEatenPieces] = useState<Piece[]>([]);
  const [moveHistory, setMoveHistory] = useState<
    | {
        whiteMove: Move | null;
        blackMove: Move | null;
      }[]
    | null
  >(null);
  const [onMove, setOnMove] = useState<"White" | "Black" | null>(null);
  const [roomId, setRoomId] = useState("");
  const [playerColor, setPlayerColor] = useState<"Black" | "White" | null>(
    null
  );
  const [status, setStatus] = useState("Waiting for opponent...");

  const userInfo = JSON.parse(localStorage.getItem("loginInfo")!);

  useEffect(() => {
    socketService.connect("http://localhost:3000");
    socketService.joinRoom(userInfo.id, { matchTime, addition });

    // socketService.waitForOpponent();

    socketService.onGameStart(
      (data: {
        roomId: string;
        players: { color: "Black" | "White"; userId: string }[];
      }) => {
        const user =
          data.players[0].userId == userInfo.id
            ? data.players[0]
            : data.players[1];
        // const opponent =
        //   data.players[0].userId == userInfo.id
        //     ? data.players[1]
        //     : data.players[0];

        setPlayerColor(user.color);

        setStatus(
          `Game started in room ${data.roomId} — you play as ${user.color}`
        );
        setRoomId(data.roomId);
        // gameService.startGame(
        //   user.color == "White" ? user.userId : opponent.userId,
        //   user.color == "Black" ? user.userId : opponent.userId,
        //   user.color,
        //   data.roomId,
        //   { matchTime, addition }
        // );
        localStorage.setItem("game", JSON.stringify({ roomId: data.roomId }));
        navigate(`/game/${data.roomId}`, {
          replace: true,
          state: { time: state?.time ?? 6, addition: state?.addition ?? 0 },
        });
        console.log(status);
      }
    );

    // Optionally cleanup on unmount:
    return () => {
      socketService.disconnect(); // if you have this method
    };
  }, []); // <---- here!

  return (
    <div className="game-screen">
      <SideNav />
      <div className="board-screen">
        <div className="info-bar">
          <div className="user-info">
            <img
              src="logo-images/user.png"
              alt="profile-pic"
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "black",
                border: "2px solid white",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div className="profile">
              <div className="username">
                <span>{userInfo.userName}</span>
                <span>({userInfo.elo})</span>
              </div>

              <div className="eaten-pieces">
                {whiteEatenPieces
                  .sort(
                    (a: Piece, b: Piece) =>
                      (myMap.get(a.toString()) ?? 0) -
                      (myMap.get(b.toString()) ?? 0)
                  )
                  .map((piece, index) => (
                    <div key={index}>
                      <PieceComp piece={piece} className={"eaten"} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            className={
              "clock-container " + (onMove == "Black" ? "on-move" : "wait")
            }
          >
            <MyTimer start={matchTime} isRunning={onMove == "Black"}></MyTimer>
          </div>
        </div>
        <ChessBoard
          setWhiteEatenPieces={setWhiteEatenPieces}
          setBlackEatenPieces={setBlackEatenPieces}
          setMoveHistory={setMoveHistory}
          setOnMove={setOnMove}
          playerColor={playerColor}
          roomId={roomId}
        />
        <div className="info-bar">
          <div className="user-info">
            <img
              src="logo-images/user.png"
              alt="profile-pic"
              style={{
                width: "45px",
                height: "45px",
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div className="profile">
              <div className="username">
                <span>{userInfo.userName}</span>
                <span>({userInfo.elo})</span>
              </div>

              <div className="eaten-pieces">
                {blackEatenPieces
                  .sort(
                    (a: Piece, b: Piece) =>
                      (myMap.get(a.toString()) ?? 0) -
                      (myMap.get(b.toString()) ?? 0)
                  )
                  .map((piece, index) => (
                    <div key={index}>
                      <PieceComp piece={piece} className={"eaten"} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            className={
              "clock-container " + (onMove == "White" ? "on-move" : "wait")
            }
          >
            <MyTimer start={matchTime} isRunning={onMove == "White"}></MyTimer>
          </div>
        </div>
      </div>
      <div className="left-side">
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <i className="fa-solid fa-backward-fast left-side-icon"></i>

          <i className="fa-solid fa-backward left-side-icon"></i>

          <i className="fa-solid fa-forward left-side-icon"></i>

          <i className="fa-solid fa-forward-fast left-side-icon"></i>
        </div>
        <MoveHistory moveHistory={moveHistory} />
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div className="options">
            <i className="fa-solid fa-flag left-side-icon"></i>
            <span className="tooltip-text">Resign</span>
          </div>
          <div className="options">
            <i className="fa-solid fa-handshake left-side-icon"></i>
            <span className="tooltip-text">Offer Draw</span>
          </div>
          <div className="options">
            <i className="fa-solid fa-stopwatch-20 left-side-icon"></i>
            <span className="tooltip-text">Add opponent 20 seconds</span>
          </div>
          <div className="options">
            <i className="fa-solid fa-clock-rotate-left left-side-icon"></i>
            <span className="tooltip-text">Propose return of move</span>
          </div>
        </div>
        {/* <div className="game-chat" style={{ alignContent: "center" }}>
          <i className="fa-solid fa-comments left-side-icon"></i>
          <span className="tooltip-text">Resign</span>
        </div> */}
      </div>
      {/* <div className="right-side">
        <div className="top-video"> video call</div>
        <div className="bottom-video"> video call</div>
      </div> */}
    </div>
  );
};

export default GameScreen;
