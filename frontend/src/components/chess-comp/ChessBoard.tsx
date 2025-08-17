import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import "../../styles/Board.css";

import {
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
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  setOnMove,
  setBlackEatenPieces,
  setWhiteEatenPieces,
  setMoveHistory,
  playerColor,
  roomId,
  startBoardState,
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

  useEffect(() => {
    const initialBoard = startBoardState
      ? startBoardState
      : Board.createStandardBoard();
    setGameBoard(initialBoard);
    updateBoardFromGame(initialBoard);
  }, [startBoardState]);

  useEffect(() => {
    if (!socketService.socket) return;

    socketService.getMove((moveCordinations: { from: number; to: number }) =>
      applyMove(moveCordinations)
    );

    return () => {
      socketService?.off();
    };
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

  const handleTileClick = (tileIndex: number) => {
    console.log(playerColor);
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
      const moveData = {
        from: selectedTile,
        to: tileIndex,
      };
      console.log(roomId);
      socketService.sendMove(roomId, moveData);

      setSelectedTile(null);
      setHighlightedMoves([]);

      applyMove(moveData); // Immediately apply your own move
    }
  };

  const applyMove = (moveData: { from: number; to: number }) => {
    const { from, to } = moveData;
    if (!gameBoard) return;

    const move = MoveFactory.createMove(gameBoard, from, to);
    const transition = gameBoard.getCurrentPlayer().makeMove(move);

    if (move && transition.getMoveStatus() === MoveStatus.DONE) {
      let newBoard;

      setMoveHistory((prev) => {
        // Else start a new move with whiteMove
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
      // Add 5 seconds to the player who just moved
      setOnMove(onMove);

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
    applyMove(moveData); // Your chess logic here
  };

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
