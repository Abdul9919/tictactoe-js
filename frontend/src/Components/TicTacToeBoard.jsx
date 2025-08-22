import React, { useState } from "react";
import SocketContext from "../Contexts/SocketContext";

const TicTacToeBoard = ({ board, setBoard, playerSign, room, turn }) => {
  const socket = React.useContext(SocketContext);
  const [animatedCells, setAnimatedCells] = useState([]); // Track which cells should animate

  const handleClick = (index) => {
    if (board[index] !== 0) return;
    if (!playerSign) return;
    if ((turn || "").toLowerCase() !== (playerSign || "").toLowerCase()) return;

    const newBoard = [...board];
    newBoard[index] = playerSign.toUpperCase();
    setBoard(newBoard);

    // Trigger animation for this cell
    setAnimatedCells((prev) => [...prev, index]);

    socket.emit("updateBoard", { board: newBoard, room });
    socket.emit("getTurn", { turn, room });
  };

  const renderCell = (value, index) => {
    if (value === 0) return "";

    const shouldAnimate = animatedCells.includes(index);

    return (
      <span
        className={`inline-block text-6xl font-bold text-[#5a3a00] transform transition-transform duration-300 ease-out ${
          shouldAnimate ? "scale-125" : "scale-100"
        }`}
        onTransitionEnd={() => {
          // After animation ends, reset cell back to normal scale
          setAnimatedCells((prev) => prev.filter((i) => i !== index));
        }}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
      {/* Grid Lines */}
      <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-[#895b03] rounded-full"></div>
      <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-[#895b03] rounded-full"></div>
      <div className="absolute left-0 right-0 top-1/3 h-2 bg-[#895b03] rounded-full"></div>
      <div className="absolute left-0 right-0 top-2/3 h-2 bg-[#895b03] rounded-full"></div>

      {/* Cells */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {board.map((value, i) => (
          <div
            key={i}
            className="flex items-center justify-center cursor-pointer select-none"
            onClick={() => handleClick(i)}
          >
            {renderCell(value, i)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeBoard;
