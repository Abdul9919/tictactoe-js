import React from 'react'
import { useNavigate } from 'react-router-dom'
import SocketContext from '../Contexts/SocketContext'
const Footer = ({roomName, name ,setRoomName}) => {
    const navigate = useNavigate();
    const socket = React.useContext(SocketContext)
    const handleSubmit = (e) => {
        e.preventDefault()

        if(roomName) {
            socket.emit('createRoom', {room: roomName, members : [name]})
            navigate(`/room/${roomName}`);
        }
        setRoomName('');
    }

    return (
        <div>
        <h2 className="text-center text-xl font-bold text-[#845115] mb-2">
            Create Room
        </h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="ml-[23%] px-4 py-2 rounded-lg border border-[#895b03] focus:outline-none focus:ring-2 focus:ring-[#c49a30]
             bg-[#fffaf0] text-[#333]"
            />  
        </form>

        </div>
    )
}

export default Footer