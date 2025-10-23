import React, { useState } from "react";
import SocketContext from "../Contexts/SocketContext";
import axios from "axios";

const TicTacToeBoard = ({ board, setBoard, playerSign, room, turn, setTurn }) => {
  const socket = React.useContext(SocketContext);
  const [animatedCells, setAnimatedCells] = useState([]); // Track which cells should animate

  const webhook = async (newBoard) => {
    try {
      const response = await axios.post("http://192.168.18.41:5678/webhook/330b6a84-108d-4986-8579-c9405b85ddca", {
        board: [...newBoard],
      });
      console.log('n8n response',response.data)
      setTurn('o')
      const updatedBoard = response.data.board.split(",").map(e => e === "0" ? 0 : e);
      setBoard(updatedBoard);
      
    } catch (error) {
      console.log("AI move error:", error);
    }
  };

  // useEffect(() => {
  //   let interval;
  //   if (room.toString() === "ai" && turn === "x") {
  //     interval = setInterval(async () => {
  //       try {
  //         const response = await axios.get("http://192.168.18.41:5000/latest");
  //         if (response.data.board) {
  //           const newBoard = response.data.board;
  //           console.log(newBoard);
  //           setBoard(newBoard);
  //           setTurn("o");
  //         }
  //       } catch (error) {
  //         console.log("AI move error:", error);
  //       }
  //     }, 1000);
  //   }

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [room, turn, setBoard, setTurn]);

  const handleClick = async (index) => {
    console.log({ turn, playerSign });
    // if (room === "ai") turn === 'x' && playerSign === 'o' ? setTurn('o') : setTurn('x');
    if (room === "ai") playerSign = "o";
    if (board[index] !== 0) return;
    if (!playerSign) return;
    console.log({ turn, playerSign });
    if ((turn || "").toLowerCase() !== (playerSign || "").toLowerCase()) return;

    const newBoard = [...board];
    newBoard[index] = playerSign.toUpperCase();
    setBoard(newBoard);

    if (room === "ai") {
      setTurn("x");
      await webhook(newBoard);
      return;
    }

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
