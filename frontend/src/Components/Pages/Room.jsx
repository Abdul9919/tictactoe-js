// Room.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import RoomHeader from "../RoomHeader";
import TicTacToeBoard from "../TicTacToeBoard";
import ChatBox from "../ChatBox";
import SocketContext from "../../Contexts/SocketContext";

const Room = () => {
  const { roomName } = useParams();

  const [board, setBoard] = useState(Array(9).fill(0));
  // playerSign now comes from server ('' until server assigns)
  const [playerSign, setPlayerSign] = useState("");

  const [turn, setTurn] = useState("o");
  const [won, setWon] = useState(false);

  // UI state
  const [heading, setHeading] = useState("");
  const [dots, setDots] = useState("");
  const [isWaiting, setIsWaiting] = useState(true);

  const socket = useContext(SocketContext);

  // refs to hold latest values for event handlers (avoid stale closures)
  const turnRef = useRef(turn);
  const wonRef = useRef(won);
  const playerSignRef = useRef(playerSign);
  const isWaitingRef = useRef(isWaiting);

  useEffect(() => { turnRef.current = turn; }, [turn]);
  useEffect(() => { wonRef.current = won; }, [won]);
  useEffect(() => { playerSignRef.current = playerSign; }, [playerSign]);
  useEffect(() => { isWaitingRef.current = isWaiting; }, [isWaiting]);

  // Animated dots for waiting message
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Heading while waiting
  useEffect(() => {
    if (isWaiting && !wonRef.current) {
      setHeading(`waiting for player${dots}`);
    }
  }, [dots, isWaiting]);

  // Socket listeners (registered once)
  useEffect(() => {
    if (!socket) return;

    const handlePlayerAssigned = ({ room: r, playerSign: sign }) => {
      if (r !== roomName) return;
      const normalized = sign ? sign.toLowerCase() : "";
      setPlayerSign(normalized);
      if (turnRef.current && normalized && !wonRef.current) {
        if (turnRef.current === normalized) {
          setHeading(`Your turn: ${turnRef.current.toUpperCase()}`);
        } else {
          setHeading(`Turn: ${turnRef.current.toUpperCase()}`);
        }
      }
    };

    const handleJoined = ({ roomName: rName, players }) => {
      if (rName !== roomName) return;
      setIsWaiting(false);
      const currentTurn = turnRef.current;
      if (!wonRef.current) {
        if (playerSignRef.current && currentTurn === playerSignRef.current) {
          setHeading(`Your turn: ${currentTurn.toUpperCase()}`);
        } else {
          setHeading(`Turn: ${currentTurn.toUpperCase()}`);
        }
      }
    };

    const handleBoardUpdated = ({ board: newBoard }) => {
      setBoard(newBoard);
    };

    const handleTurnChanged = ({ turn: newTurn }) => {
      if (wonRef.current) return;
      setIsWaiting(false);
      setTurn(newTurn);
      if (!wonRef.current) {
        if (playerSignRef.current && newTurn === playerSignRef.current) {
          setHeading(`Your turn: ${newTurn.toUpperCase()}`);
        } else {
          setHeading(`Turn: ${newTurn.toUpperCase()}`);
        }
      }
    };

    const handleGameWon = (payload) => {
      // lock immediately
      wonRef.current = true;
      setWon(true);
      const winner = (payload && (payload.player || payload.winner)) || turnRef.current;
      const label = typeof winner === "string" && winner.length === 1 ? winner.toUpperCase() : winner;
      console.log(`Player ${label} has won`);
      setHeading(`${label} has won the game`);
      setTurn("");
    };

    socket.on("playerAssigned", handlePlayerAssigned);
    socket.on("joinedRoom", handleJoined);
    socket.on("boardUpdated", handleBoardUpdated);
    socket.on("turnChanged", handleTurnChanged);
    socket.on("gameWon", handleGameWon);

    // Ask server what our sign is
    socket.emit("requestPlayerSign", { room: roomName });

    return () => {
      socket.off("playerAssigned", handlePlayerAssigned);
      socket.off("joinedRoom", handleJoined);
      socket.off("boardUpdated", handleBoardUpdated);
      socket.off("turnChanged", handleTurnChanged);
      socket.off("gameWon", handleGameWon);
    };
  }, [socket, roomName]);

  return (
    <div className="flex flex-col h-screen bg-center bg-[#eeb953] bg-cover text-[#5a3a00]">
      <RoomHeader heading={heading} />
      <div className="flex-1 flex items-center justify-center">
        <TicTacToeBoard
          board={board}
          setBoard={setBoard}
          playerSign={playerSign}
          room={roomName}
          turn={turn}
          setTurn={setTurn}
        />
      </div>
      <ChatBox />
    </div>
  );
};

export default Room;
