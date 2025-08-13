import React from "react";

const TicTacToeBoard = ({ setCurrentTurn, currentTurn,board, setBoard }) => {
  const handleClick = (index) => {
    if(currentTurn === 1){
      const newBoard = [...board];
      newBoard[index] = newBoard[index] === 0 ? 1 : 0;
  
      setBoard(newBoard);
      setCurrentTurn((prev) => (prev === 1 ? 2 : 1));
      console.log("Board updated:", newBoard);
      
    }
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
            className="flex items-center justify-center text-6xl font-bold text-[#5a3a00]"
            onClick={() => handleClick(i)}
          >
            {value === 1 && "O"}
            {value === 2 && "X"}
            {/* value === 0 → empty */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToeBoard;
