import "../styles/GameScreen.css";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SideNav from "../components/app-comp/side-nav";
import MyTimer from "../components/app-comp/Timer";
import MoveHistory from "../components/app-comp/MoveHistory";
import ChessBoard from "../components/chess-comp/ChessBoard";
import PieceComp from "../components/chess-comp/Piece";
import Piece from "../../../sharedGameLogic/pieceLogic/Piece";

import { socketService } from "../services/socket-service";
import { gameService } from "../services/game-service";
import type Board from "../../../sharedGameLogic/boardLogic/Board";
import { aiBotService } from "../services/ai-bot-service";
import Chat from "../components/app-comp/Chat";

const myMap = new Map<string, number>();
myMap.set("P", 1);
myMap.set("N", 3);
myMap.set("B", 3.5);
myMap.set("R", 5);
myMap.set("Q", 9);

type GameNavState = {
  matchTime: number;
  addition: number;
  botOrPlayer: "player" | "bot";
  opponent: string | number;
};

const GameScreen = () => {
  const { state } = useLocation() as { state: GameNavState | null };
  const addition = state?.addition ?? 0;
  const matchTime = state?.matchTime ?? 6;
  const botOrPlayer = state?.botOrPlayer ?? "player";
  const opponent = state?.opponent ?? "random";

  const navigate = useNavigate();
  const [whiteEatenPieces, setWhiteEatenPieces] = useState<Piece[]>([]);
  const [blackEatenPieces, setBlackEatenPieces] = useState<Piece[]>([]);
  const [moveHistory, setMoveHistory] = useState<
    | {
        from: number;
        to: number;
        notation: string;
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
  const [boardState, setBoardState] = useState<null | Board>(null);
  const [opponentId, setOpponentId] = useState("");

  const startedRef = useRef(false);

  useEffect(() => {
    if (botOrPlayer !== "player") return;
    socketService.connect("https://rudechess.xyz");

    // socketService.connect("http://localhost:3000");

    const storedRoomId = localStorage.getItem("roomId");
    if (storedRoomId) {
      console.log("Reconnecting to room:", storedRoomId);

      socketService.reconnect(storedRoomId, userInfo.id);

      (async () => {
        const res = await gameService.requestGameState(storedRoomId);
        if (res) {
          const board: Board = gameService.createBoardFromDB(res.boardState);
          setBoardState(board);
          setMoveHistory(res.moveHistory);
          setOnMove(res.moveHistory?.length % 2 == 0 ? "White" : "Black");
          setStatus(`Rejoined game in room ${storedRoomId}`);
          setPlayerColor(res.whitePlayerId == userInfo.id ? "White" : "Black");
          setOpponentId(
            res.whitePlayerId == userInfo.id
              ? res.blackPlayerId
              : res.whitePlayerId
          );

          setRoomId(storedRoomId);

          navigate(`/game/${storedRoomId}`, {
            replace: true,
            state: {
              matchTime: state?.matchTime ?? 6,
              addition: state?.addition ?? 0,
            },
          });
          console.log(status);
        }
      })();
    } else {
      socketService.joinRoom(userInfo.id, {
        initial: matchTime,
        increment: addition,
      });

      socketService.onGameStart(
        (data: {
          roomId: string;
          players: { color: "Black" | "White"; userId: string }[];
        }) => {
          const user =
            data.players[0].userId == userInfo.id
              ? data.players[0]
              : data.players[1];

          setOpponentId(
            data.players[0].userId == userInfo.id
              ? data.players[1].userId
              : data.players[0].userId
          );

          setPlayerColor(user.color);
          setStatus(
            `Game started in room ${data.roomId} — you play as ${user.color}`
          );
          setRoomId(data.roomId);

          localStorage.setItem("roomId", data.roomId);
          navigate(`/game/${data.roomId}`, {
            replace: true,
            state: {
              matchTime: state?.matchTime ?? 6,
              addition: state?.addition ?? 0,
            },
          });
        }
      );
    }

    return () => {
      socketService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (botOrPlayer !== "bot" || roomId || startedRef.current) return;
    startedRef.current = true;

    const startBotGame = async () => {
      const level = typeof opponent === "number" ? opponent : 10;
      try {
        const res = await aiBotService.startGame(userInfo.id, level);
        setRoomId(res.roomId);

        setPlayerColor("White");
        navigate(`/game/bot`, {
          replace: true,
          state: { matchTime, addition, opponent, botOrPlayer },
        });
      } catch (err) {
        console.error("Failed to start bot game:", err);
      }
    };

    startBotGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="game-screen">
      <SideNav />
      <div className="board-screen">
        <div className="info-bar">
          <div className="user-info">
            <img
              src="/logo-images/user.png"
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
            <MyTimer
              start={matchTime * 60}
              isRunning={onMove == "Black"}
            ></MyTimer>
          </div>
        </div>
        <ChessBoard
          setWhiteEatenPieces={setWhiteEatenPieces}
          setBlackEatenPieces={setBlackEatenPieces}
          setMoveHistory={setMoveHistory}
          setOnMove={setOnMove}
          playerColor={playerColor}
          roomId={roomId}
          startBoardState={boardState}
          botOrPlayer={botOrPlayer}
        />
        <div className="info-bar">
          <div className="user-info">
            <img
              src="/logo-images/user.png"
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
            <MyTimer
              start={matchTime * 60}
              isRunning={onMove == "White"}
            ></MyTimer>
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
        <MoveHistory moveHistory={moveHistory} />

        <div
          className="game-chat"
          style={{ position: "fixed", bottom: "20px" }}
        >
          <Chat userId={userInfo.id} friendId={opponentId} roomId={roomId} />
          <span className="tooltip-text">Chat</span>
        </div>
      </div>
      {/* <div className="right-side">
        <div className="top-video"> video call</div>
        <div className="bottom-video"> video call</div>
      </div> */}
    </div>
  );
};

export default GameScreen;
