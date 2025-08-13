
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomHeader from "../RoomHeader";
import TicTacToeBoard from "../TicTacToeBoard";
import ChatBox from "../ChatBox";
import SocketContext from "../../Contexts/SocketContext";

const Room = ({ playerCount = 1 }) => {
  const [dots, setDots] = useState("");
  const { room } = useParams();
  const [countdown, setCountdown] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(0));
  const [currentTurn, setCurrentTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const socket = React.useContext(SocketContext);

  // --- Winning check function ---
  const checkWinner = (brd) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let [a, b, c] of winPatterns) {
      if (brd[a] !== 0 && brd[a] === brd[b] && brd[a] === brd[c]) {
        return brd[a]; // returns 1 or 2
      }
    }
    return null;
  };

  // --- Emit updated board when it changes ---
  useEffect(() => {
    socket.emit("updateBoard", { board, room });
  }, [board]);

  // --- Listen for updates from other player ---
  useEffect(() => {
    socket.on("boardUpdated", (updatedBoard) => {
      setBoard(updatedBoard);
      setCurrentTurn((prev) => (prev === 1 ? 2 : 1));
    });

    return () => {
      socket.off("boardUpdated");
    };
  }, [board, socket]);

  // --- Check winner or draw every time board changes ---
  useEffect(() => {
    const gameWinner = checkWinner(board);

    if (gameWinner) {
      setWinner(gameWinner);
    } else if (!board.includes(0)) {
      setWinner("draw");
    }
  }, [board]);

  // --- Waiting dots animation ---
  useEffect(() => {
    if (playerCount === 1) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [playerCount]);

  // --- Listen for joinedRoom event ---
  useEffect(() => {
    socket.on("joinedRoom", ({ roomName, name }) => {
      console.log(`${name} joined room: ${roomName}`);
      playerCount++;
    });

    return () => {
      socket.off("joinedRoom");
    };
  }, []);

  // --- Start countdown when 2nd player joins ---
  useEffect(() => {
    if (playerCount === 2) {
      setCountdown(10);
    }
  }, [playerCount]);

  // --- Countdown timer ---
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // --- Determine heading ---
  let heading = "";
  if (winner) {
    if (winner === "draw") heading = "It's a draw!";
    else heading = winner === 1 ? "Player O wins!" : "Player X wins!";
  } else if (playerCount === 1) {
    heading = `Waiting for a Player${dots}`;
  } else if (playerCount === 2 && countdown > 0) {
    heading = `Game starting in ${countdown}...`;
  } else if (currentTurn) {
    heading = currentTurn === 1 ? "Your turn" : "Opponent's turn";
  }

  return (
    <div className="flex flex-col h-screen bg-center bg-[#eeb953] bg-cover text-[#5a3a00]">
      <RoomHeader heading={heading} />
      <div className="flex-1 flex items-center justify-center">
        <TicTacToeBoard
          setCurrentTurn={setCurrentTurn}
          currentTurn={currentTurn}
          board={board}
          setBoard={setBoard}
        />
      </div>
      <ChatBox />
    </div>
  );
};

export default Room;