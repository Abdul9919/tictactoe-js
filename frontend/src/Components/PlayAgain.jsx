import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SocketContext from "../Contexts/SocketContext";

const PlayAgain = ({ setPlayAgain, setBoard, setTurn, wonRef, room }) => {
  const socket = React.useContext(SocketContext);
  const { roomName } = useParams();
  const countdown = useRef(20);
  const [seconds, setSeconds] = useState(20); // ✅ state to trigger re-renders
  const [agreedPlayers, setAgreedPlayers] = useState([]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      countdown.current -= 1;
      setSeconds(countdown.current);
      if (countdown.current <= 0) {
        clearInterval(interval);
        setPlayAgain(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [setPlayAgain]);

  // Socket listeners
  useEffect(() => {
    const handlePlayAgain = (updatedAgreedPlayers) => {
      console.log("Players agreed to play again:", updatedAgreedPlayers);
      setAgreedPlayers(updatedAgreedPlayers.agreedPlayers);

      // ✅ If all players agreed, stop timer + close modal
      if (updatedAgreedPlayers.agreedPlayers.length === 2) {
        setPlayAgain(false);
        countdown.current = 0;
        setSeconds(0);
      }
    };

    const handleResetGame = ({ board }) => {
      setBoard(board);
      setPlayAgain(false); // ✅ close modal on reset
      setTurn("o"); // ✅ reset turn to 'o'
      wonRef.current = false; 
    };

    socket.on("playAgain", handlePlayAgain);
    socket.on("resetGame", handleResetGame);

    return () => {
      socket.off("playAgain", handlePlayAgain);
      socket.off("resetGame", handleResetGame);
    };
  }, [socket, setBoard, setPlayAgain]);

  const onReject = () => {
    setPlayAgain(false);
  };

  const onAccept = () => {

    if(room === 'ai') {
      setBoard(Array(9).fill(0))
      setTurn('O')
      setPlayAgain(false)
      wonRef.current = false;
      return;
    }  

    // Add myself to local list
    setAgreedPlayers((prev) =>
      prev.includes(socket.id) ? prev : [...prev, socket.id]
    );

    // Send update to server
    socket.emit("playAgain", { roomName, agreedPlayers: [...agreedPlayers, socket.id] });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      aria-labelledby="play-again-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        tabIndex={-1}
        className="relative mx-4 w-full max-w-md scale-100 rounded-3xl border-4 border-[#895b03] bg-[#eeb953] p-6 shadow-2xl outline-none transition-all"
      >
        {/* Heading */}
        <h2
          id="play-again-title"
          className="text-center text-2xl font-extrabold tracking-wide text-[#3b2a02]"
        >
          Play Again?
        </h2>

        {/* Countdown */}
        <h2 className="text-center text-xl font-bold text-[#3b2a02]">
          {seconds}s
        </h2>

        {/* Players list */}
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border-2 border-[#895b03]/50 bg-[#ffd870] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-[#3b2a02]">Players ready</span>
              <span className="text-sm text-[#3b2a02]/80">
                {agreedPlayers.length} ready
              </span>
            </div>

            {agreedPlayers.length === 0 ? (
              <p className="text-sm text-[#3b2a02]/70">
                Waiting for players to confirm…
              </p>
            ) : (
              <ul className="max-h-40 list-none space-y-1 overflow-auto pr-1">
                {agreedPlayers.map((id, idx) => (
                  <li
                    key={`${id}-${idx}`}
                    className="flex items-center justify-between rounded-lg bg-white/40 px-3 py-1"
                  >
                    <span className="truncate font-medium text-[#3b2a02]">
                      {id}
                    </span>
                    <span aria-label="agreed" title="agreed">
                      ✓
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onReject}
            className="rounded-xl bg-[#895b03] px-4 py-2 font-bold text-white shadow-md transition-all hover:bg-[#a86f04] hover:shadow-lg active:scale-95"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-xl bg-[#895b03] px-4 py-2 font-bold text-white shadow-md transition-all hover:bg-[#a86f04] hover:shadow-lg active:scale-95"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayAgain;
