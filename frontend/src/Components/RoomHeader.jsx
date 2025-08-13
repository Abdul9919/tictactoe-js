
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SocketContext from "../Contexts/SocketContext";
const RoomHeader = ({ heading, }) => {
    const navigate = useNavigate();
    const {roomName} = useParams();
    const socket = React.useContext(SocketContext);
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#eeb953] border-b border-[#895b03]">
      <button
        onClick={() => {
          navigate(-1);
          socket.emit('leaveRoom', { roomName});
        }}
        className="flex items-center gap-1 text-[#5a3a00] font-semibold hover:cursor-pointer hover:text-[#7b4f00] transition-colors"
      >
        <ArrowLeft size={18} />
        Leave
      </button>
      <h1 className="text-lg font-bold">{heading}</h1>
      <div className="w-12" /> {/* Spacer for symmetry */}
    </div>
  );
};

export default RoomHeader;