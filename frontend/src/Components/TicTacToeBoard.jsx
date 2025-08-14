import React from "react";
import SocketContext from "../Contexts/SocketContext";

const TicTacToeBoard = ({ board, setBoard, playerSign, room }) => {
  const socket = React.useContext(SocketContext);

  const handleClick = (index) => {
    // Don't allow playing on an occupied cell
    if (board[index] !== 0) return;

    // Place *your* move as 1 (server flips 1↔2 for the other player)
    const newBoard = [...board];
    newBoard[index] = 1;

    setBoard(newBoard);
    socket.emit("updateBoard", { board: newBoard, room });
  };

  // Helper to render correctly based on playerSign and cell value
  const renderCell = (value) => {
    if (value === 0) return "";
    if (value === 1) return (playerSign || "").toUpperCase(); // your mark
    // opponent's mark
    return (playerSign || "").toLowerCase() === "x" ? "O" : "X";
  };

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
      {/* Vertical lines */}
      <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-[#895b03] rounded-full"></div>
      <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-[#895b03] rounded-full"></div>

      {/* Horizontal lines */}
      <div className="absolute left-0 right-0 top-1/3 h-2 bg-[#895b03] rounded-full"></div>
      <div className="absolute left-0 right-0 top-2/3 h-2 bg-[#895b03] rounded-full"></div>

      {/* Game marks layer */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {board.map((value, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-6xl font-bold text-[#5a3a00] cursor-pointer"
            onClick={() => handleClick(i)}
          >
            {renderCell(value)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeBoard;
