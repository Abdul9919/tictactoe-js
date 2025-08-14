import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomHeader from "../RoomHeader";
import TicTacToeBoard from "../TicTacToeBoard";
import ChatBox from "../ChatBox";
import SocketContext from "../../Contexts/SocketContext";

const Room = () => {
  const { roomName } = useParams();
  const [board, setBoard] = useState(Array(9).fill(0));
  const playerSign = localStorage.getItem("playerSign");
  const socket = React.useContext(SocketContext);

  useEffect(() => {
    const handleBoardUpdated = ({ board }) => {
      setBoard(board);
      console.log("Board updated from server:", board);
    };

    socket.on("boardUpdated", handleBoardUpdated);

    return () => {
      socket.off("boardUpdated", handleBoardUpdated);
    };
  }, [socket]);

  const heading = `Room: ${roomName}`;

  return (
    <div className="flex flex-col h-screen bg-center bg-[#eeb953] bg-cover text-[#5a3a00]">
      <RoomHeader heading={heading} />
      <div className="flex-1 flex items-center justify-center">
        <TicTacToeBoard
          board={board}
          setBoard={setBoard}
          playerSign={playerSign}
          room={roomName}
        />
      </div>
      <ChatBox />
    </div>
  );
};

export default Room;
