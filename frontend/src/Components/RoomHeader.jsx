import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SocketContext from "../Contexts/SocketContext";

const RoomHeader = () => {
  const navigate = useNavigate();
  const { roomName } = useParams();
  const socket = React.useContext(SocketContext);

  const [dots, setDots] = React.useState("");
  const [heading, setHeading] = React.useState("Waiting for other player");

  React.useEffect(() => {
    // Listen for other player joining
    socket.on("joinedRoom", ({ roomName, socketId }) => {
      setHeading(`Player ${socketId} joined ${roomName}`);
    });

    return () => {
      socket.off("joinedRoom");
    };
  }, [socket]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#eeb953] border-b border-[#895b03]">
      <button
        onClick={() => {
          navigate(-1);
          socket.emit("leaveRoom", { roomName });
        }}
        className="flex items-center gap-1 text-[#5a3a00] font-semibold hover:cursor-pointer hover:text-[#7b4f00] transition-colors"
      >
        <ArrowLeft size={18} />
        Leave
      </button>

      {/* Heading with dots */}
      <h1 className="text-lg font-bold">
        {heading.includes("Waiting") ? `${heading}${dots}` : heading}
      </h1>

      <div className="w-12" /> {/* Spacer for symmetry */}
    </div>
  );
};

export default RoomHeader;
