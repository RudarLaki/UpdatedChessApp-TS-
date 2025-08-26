import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import "../../styles/Board.css";
import { playSound } from "../../utils/audios";

import {
  AttackMove,
  CastleMove,
  MajorMove,
  MoveFactory,
  PawnPromotionMove,
  type Move,
} from "../../../../sharedGameLogic/boardLogic/moveLogic/Move";

import Board from "../../../../sharedGameLogic/boardLogic/Board";
import { MoveStatus } from "../../../../sharedGameLogic/boardLogic/moveLogic/MoveStatus";
import {
  Alliance,
  type AllianceType,
} from "../../../../sharedGameLogic/boardLogic/Alliance";
import type MoveTransition from "../../../../sharedGameLogic/boardLogic/moveLogic/MoveTransition";

import type Piece from "../../../../sharedGameLogic/pieceLogic/Piece";
import King from "../../../../sharedGameLogic/pieceLogic/King";
import Queen from "../../../../sharedGameLogic/pieceLogic/Queen";
import Rook from "../../../../sharedGameLogic/pieceLogic/Rook";
import Bishop from "../../../../sharedGameLogic/pieceLogic/Bishop";
import Knight from "../../../../sharedGameLogic/pieceLogic/Knight";

import PromotionPanel from "./PromotionPanel";
import Tile from "./Tile";
import { socketService } from "../../services/socket-service";
import type {
  GetMoveRequest,
  SendMoveRequest,
} from "../../../../sharedGameLogic/types/game";
import { aiBotService } from "../../services/ai-bot-service";

type ChessBoardProps = {
  setOnMove: Dispatch<SetStateAction<"White" | "Black" | null>>;
  setBlackEatenPieces: Dispatch<SetStateAction<Piece[]>>;
  setWhiteEatenPieces: Dispatch<SetStateAction<Piece[]>>;

  setMoveHistory: Dispatch<
    SetStateAction<
      | {
          from: number;
          to: number;
          notation: string;
        }[]
      | null
    >
  >;
  playerColor: "Black" | "White" | null;
  roomId: string;
  startBoardState: Board | null;
  botOrPlayer: "bot" | "player";
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  setOnMove,
  setBlackEatenPieces,
  setWhiteEatenPieces,
  setMoveHistory,
  playerColor,
  roomId,
  startBoardState,
  botOrPlayer,
}) => {
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [boardState, setBoardState] = useState(new Array(64).fill(null));
  const [gameBoard, setGameBoard] = useState<Board | undefined>(undefined);
  const [highlightedMoves, setHighlightedMoves] = useState<number[] | null>(
    null
  );
  const [kingInCheck, setKingInCheck] = useState<number | null>(null);
  const [promotionData, setPromotionData] = useState<{
    show: boolean;
    cordinate: number | null;
    alliance: AllianceType | null;
  }>({
    show: false,
    cordinate: null,
    alliance: null,
  });

  const [botMove, setBotMove] = useState("");

  const movesForBotRef = useRef<string[]>([]);

  useEffect(() => {
    const initialBoard = startBoardState
      ? startBoardState
      : Board.createStandardBoard();
    setGameBoard(initialBoard);
    updateBoardFromGame(initialBoard);
  }, [startBoardState]);

  useEffect(() => {
    if (botOrPlayer !== "bot" || botMove == "") return;
    applyMove(uciToIndex(botMove));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botMove, botOrPlayer]);

  useEffect(() => {
    const runBotMove = async () => {
      if (
        botOrPlayer === "bot" &&
        playerColor !== gameBoard?.getCurrentPlayer().getAlliance().toString()
      ) {
        if (movesForBotRef.current.length == 0) return;

        const bestMove = await aiBotService.makeMove(
          roomId,
          movesForBotRef.current
        );
        movesForBotRef.current.push(bestMove);
        setBotMove(bestMove);
        return;
      }
    };
    const runMove = () => {
      if (!socketService.socket) return;

      socketService.getMove((getMoveRequest: GetMoveRequest) => {
        applyMove(getMoveRequest.moveData);
      });

      return () => {
        socketService?.off();
      };
    };
    if (botOrPlayer == "bot") runBotMove();
    else runMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameBoard]);

  const updateBoardFromGame = (gameBoard: Board) => {
    const newBoard = new Array(64).fill(null);
    [...gameBoard.getWhitePieces(), ...gameBoard.getBlackPieces()].forEach(
      (piece) => {
        newBoard[piece.piecePosition] = piece;
      }
    );
    setBoardState(newBoard);
  };

  const handleTileClick = async (tileIndex: number) => {
    if (
      !gameBoard ||
      playerColor !== gameBoard.getCurrentPlayer().getAlliance().toString()
    )
      return;

    if (selectedTile == null) {
      const piece = boardState[tileIndex];
      if (
        piece &&
        piece.getPieceAlliance() == gameBoard.getCurrentPlayer().getAlliance()
      ) {
        setSelectedTile(tileIndex);
        let legalMoves = piece.calculateLegalMoves(gameBoard);

        if (piece instanceof King) {
          const castleMoves = gameBoard.getCurrentPlayer().getCastleMoves();
          legalMoves = [...legalMoves, ...castleMoves];
        }

        const moveDestinations = legalMoves
          .map((move: Move) => {
            const transition = gameBoard.getCurrentPlayer().makeMove(move);
            return transition.getMoveStatus() === MoveStatus.DONE
              ? move.destinationCordinate
              : null;
          })
          .filter((destination: number) => destination !== null);
        setHighlightedMoves(moveDestinations);
      }
    } else {
      const sendMoveRequest: SendMoveRequest = {
        roomId,
        moveData: { from: selectedTile, to: tileIndex },
      };
      if (botOrPlayer == "player") socketService.sendMove(sendMoveRequest);
      setSelectedTile(null);
      setHighlightedMoves([]);

      applyMove({ from: selectedTile, to: tileIndex });
    }
  };

  const applyMove = (moveData: { from: number; to: number }) => {
    const { from, to } = moveData;
    if (!gameBoard) return;

    const move: Move | undefined = MoveFactory.createMove(gameBoard, from, to);
    const transition = gameBoard.getCurrentPlayer().makeMove(move);

    if (move && transition.getMoveStatus() === MoveStatus.DONE) {
      let newBoard;
      setMoveHistory((prev) => {
        return [
          ...(prev ?? []),
          { from: from, to: to, notation: move.toString() },
        ];
      });

      if (
        boardState[to] &&
        boardState[to].getPieceAlliance() ==
          gameBoard.getCurrentPlayer().getOpponent().getAlliance()
      ) {
        if (gameBoard.getCurrentPlayer().getAlliance() == Alliance.WHITE)
          setBlackEatenPieces((prev) => [...prev, boardState[to]]);
        else setWhiteEatenPieces((prev) => [...prev, boardState[to]]);
      }
      if (move instanceof PawnPromotionMove) {
        newBoard = handlePromotion(move, transition);
      } else {
        newBoard = transition.getBoard();
      }

      if (newBoard.getCurrentPlayer().isCheck()) {
        setKingInCheck(
          newBoard.getCurrentPlayer().getKing().getPiecePosition()
        );
      } else {
        setKingInCheck(null);
      }
      setGameBoard(newBoard);
      updateBoardFromGame(newBoard);
      const onMove = newBoard.getCurrentPlayer().getAlliance().toString();
      setOnMove(onMove);
      if (onMove == playerColor) setBotMove("");
      if (botOrPlayer == "bot" && playerColor !== onMove)
        movesForBotRef.current.push(indexToSquare(from) + indexToSquare(to));
      let audio = "";

      if (move instanceof MajorMove) audio = "move-self";
      if (move instanceof AttackMove) audio = "capture";
      if (move instanceof CastleMove) audio = "castle";
      if (move instanceof PawnPromotionMove) audio = "promote";
      if (newBoard.getCurrentPlayer().isCheck()) {
        setKingInCheck(
          newBoard.getCurrentPlayer().getKing().getPiecePosition()
        );
        audio = "move-check";
      } else {
        setKingInCheck(null);
      }
      playSound(audio);

      if (newBoard.getCurrentPlayer().isCheckMate()) {
        //
      }
    }
  };

  const handlePromotion = (move: Move, transition: MoveTransition) => {
    const movedPiece = move.getMovedPiece();
    setPromotionData({
      show: true,
      cordinate: move.getDestinationCordinate(),
      alliance: movedPiece.getPieceAlliance(),
    });
    return transition.getBoard();
  };

  const handlePromotionSelection = (pieceType: string) => {
    if (!promotionData.show || promotionData.cordinate == null) return;

    let promotedPiece;
    switch (pieceType) {
      case "Queen":
        promotedPiece = new Queen(
          promotionData.cordinate,
          promotionData.alliance!
        );
        break;
      case "Rook":
        promotedPiece = new Rook(
          promotionData.cordinate,
          promotionData.alliance!,
          false
        );
        break;
      case "Bishop":
        promotedPiece = new Bishop(
          promotionData.cordinate,
          promotionData.alliance!
        );
        break;
      case "Knight":
        promotedPiece = new Knight(
          promotionData.cordinate,
          promotionData.alliance!
        );
        break;
      default:
        promotedPiece = new Queen(
          promotionData.cordinate,
          promotionData.alliance!
        );
    }

    const builder = new Board.Builder();
    if (!(gameBoard instanceof Board)) return;
    gameBoard.getWhitePieces().forEach((piece) => {
      if (piece.getPiecePosition() !== promotedPiece.getPiecePosition()) {
        builder.setPiece(piece);
      }
    });
    gameBoard.getBlackPieces().forEach((piece) => {
      if (piece.getPiecePosition() !== promotedPiece.getPiecePosition()) {
        builder.setPiece(piece);
      }
    });

    builder.setPiece(promotedPiece);
    builder.setNextMoveMaker(gameBoard.getCurrentPlayer().getAlliance());

    const newBoard = builder.build();

    setGameBoard(newBoard);
    updateBoardFromGame(newBoard);

    if (newBoard.getCurrentPlayer().isCheck()) {
      setKingInCheck(newBoard.getCurrentPlayer().getKing().getPiecePosition());
    } else {
      setKingInCheck(null);
    }

    setPromotionData({ show: false, cordinate: null, alliance: null });
  };

  const handleDrop = (moveData: { from: number; to: number }) => {
    applyMove(moveData);
  };

  const indexToSquare = (index: number): string => {
    const file = index % 8;
    const rank = 8 - Math.floor(index / 8);
    const files = "abcdefgh";
    return files[file] + rank;
  };
  function uciToIndex(move: string): { from: number; to: number } {
    const fileToCol = (file: string) => file.charCodeAt(0) - "a".charCodeAt(0);
    const rankToRow = (rank: string) => 8 - parseInt(rank);

    const fromCol = fileToCol(move[0]);
    const fromRow = rankToRow(move[1]);
    const toCol = fileToCol(move[2]);
    const toRow = rankToRow(move[3]);

    const from = fromRow * 8 + fromCol;
    const to = toRow * 8 + toCol;
    return { from, to };
  }

  return (
    <div className="chess-board">
      {boardState.map((piece, index) => (
        <Tile
          key={index}
          row={index % 8}
          col={Math.floor(index / 8)}
          piece={piece}
          isKingInCheck={
            kingInCheck !== null &&
            kingInCheck !== undefined &&
            kingInCheck == index
          }
          isHighlighted={highlightedMoves?.includes(index) ?? false}
          onDropPiece={(fromIndex: number) =>
            handleDrop({ from: fromIndex, to: index })
          }
          onClick={() => handleTileClick(index)}
        />
      ))}

      {promotionData.show && (
        <PromotionPanel
          alliance={promotionData.alliance!}
          onSelect={handlePromotionSelection}
        />
      )}
    </div>
  );
};

export default ChessBoard;
