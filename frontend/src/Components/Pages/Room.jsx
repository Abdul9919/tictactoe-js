import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import RoomHeader from "../RoomHeader";
import TicTacToeBoard from "../TicTacToeBoard";
import ChatBox from "../ChatBox";
import SocketContext from "../../Contexts/SocketContext";

const Room = () => {
  const { roomName } = useParams();

  const [board, setBoard] = useState(Array(9).fill(0));
  // normalize playerSign from localStorage
  const rawPlayerSign = localStorage.getItem("playerSign") || "";
  const playerSign = rawPlayerSign ? rawPlayerSign.toLowerCase() : "";

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

  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);

  useEffect(() => {
    wonRef.current = won;
  }, [won]);

  useEffect(() => {
    playerSignRef.current = playerSign;
  }, [playerSign]);

  useEffect(() => {
    isWaitingRef.current = isWaiting;
  }, [isWaiting]);

  // Animated dots for waiting message
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Only show the "waiting" heading while still waiting for another player.
  useEffect(() => {
    if (isWaiting) {
      setHeading(`waiting for player${dots}`);
    }
  }, [dots, isWaiting]);

  // Socket listeners (registered once when socket/roomName changes)
  useEffect(() => {
    if (!socket) return;

    const handleJoined = ({ roomName: rName, socketId }) => {
      // another player joined -> stop waiting
      setIsWaiting(false);
      const currentTurn = turnRef.current;
      // If we already know current turn, show 'Your turn' if it's this player's sign
      if (currentTurn) {
        if (playerSignRef.current && currentTurn === playerSignRef.current) {
          setHeading(`Your turn: ${currentTurn.toUpperCase()}`);
        } else {
          setHeading(`Turn: ${currentTurn.toUpperCase()}`);
        }
      } else {
        // fallback
        setHeading(`Turn`);
      }
    };

    const handleBoardUpdated = ({ board: newBoard }) => {
      setBoard(newBoard);
    };

    const handleTurnChanged = ({ turn: newTurn }) => {
      // If the game is already won, ignore further turn updates to avoid clobbering the win heading
      if (wonRef.current) return;

      setIsWaiting(false); // gameplay started
      setTurn(newTurn);

      // Use the incoming newTurn (not the old `turn` state) to decide heading
      if (playerSignRef.current && newTurn === playerSignRef.current) {
        setHeading(`Your turn: ${newTurn.toUpperCase()}`);
      } else {
        setHeading(`Turn: ${newTurn.toUpperCase()}`);
      }
    };

    const handleGameWon = (payload) => {
      // payload may be { player } or { winner } — be flexible
      const winner = (payload && (payload.player || payload.winner)) || turnRef.current;
      const label =
        typeof winner === "string" && winner.length === 1 ? winner.toUpperCase() : winner;
      setWon(true);
      setHeading(`${label} has won the game`);
      // Do NOT clear heading afterwards. handleTurnChanged ignores updates once wonRef is true.
    };

    socket.on("joinedRoom", handleJoined);
    socket.on("boardUpdated", handleBoardUpdated);
    socket.on("turnChanged", handleTurnChanged);
    socket.on("gameWon", handleGameWon);

    return () => {
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
