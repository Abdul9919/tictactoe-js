import React from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../Contexts/SocketContext';

const RoomsList = ({ rooms }) => {
    const navigate = useNavigate();
    const socket = React.useContext(SocketContext);

    const handleJoinRoom = (roomName) => {
        socket.emit('joinRoom', { roomName });
        navigate(`/room/${roomName}`);
    };

    // Listen for 'x' event once, and clean up on unmount
    React.useEffect(() => {
        const handleJoined = (playerSign) => {
            localStorage.setItem('playerSign', playerSign);
            console.log(`Joined room with player sign: ${playerSign}`);
        };

        socket.on('x', handleJoined);

        return () => {
            socket.off('x', handleJoined);
        };
    }, [socket]);

    return (
        <div>
            <h2 className="text-lg font-bold mb-3 text-[#5a3a00]">Available Rooms</h2>
            <ul className="space-y-3">
                {rooms.map(([roomName, members], index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-[#f5d17a] border border-[#895b03] rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div>
                            <span className="font-semibold text-[#5a3a00]">{roomName}</span>
                            <span className="text-sm text-[#5a3a00]/70 ml-2">
                                ({members.length} member{members.length !== 1 ? 's' : ''})
                            </span>
                        </div>
                        <button
                            onClick={() => handleJoinRoom(roomName)}
                            className="bg-[#895b03] text-white py-1 px-3 rounded-lg text-sm font-medium shadow hover:bg-[#a86f04] transition-colors"
                        >
                            Join
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomsList;
