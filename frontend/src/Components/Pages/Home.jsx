import React, { useEffect, useState } from 'react'
import homeBg from '../../assets/home-bg.jpeg'
import Footer from '../Footer'
import RoomsList from '../RoomsList'
import SocketContext from '../../Contexts/SocketContext'
import {useNavigate} from 'react-router-dom'
const Home = () => {

 // const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [rooms, setRooms] = useState([])
  const socket = React.useContext(SocketContext)
  const navigate = useNavigate()
  useEffect(() => {
    socket.on('rooms', (rooms) => {
      console.log(rooms);
      setRooms(rooms)
    });

    return () => {
      socket.off('rooms');
    };
  }, [socket]);

  return (
    <div
      style={{ backgroundImage: `url(${homeBg})` }}
      className="flex justify-center h-screen bg-center"
    >
      <div className="flex flex-col justify-between border-4 w-full max-w-md m-10 rounded-4xl border-[#895b03] bg-[#eeb953] p-6">

        {/* Header */}
        <header>
          {/* <NameField  />  */}
        </header>
        <div className="flex flex-col mb-4">
          <button onClick={() => navigate('/room/ai')} className='bg-[#ac7002] text-white font-bold py-4 mx-[25%] mb-4 rounded-xl shadow-md transition-all duration-200 ease-in-out
           hover:bg-[#dd9206] hover:shadow-lg active:scale-95'>
            Play Against AI
          </button>
          <button
            onClick={() => socket.emit('searchRooms')}
            className="bg-[#895b03] text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all duration-200 ease-in-out
             hover:bg-[#a86f04] hover:shadow-lg active:scale-95"
          >
            🔍 Search Room
          </button>
          {rooms.length === 0 ? <span className='my-4 ml-auto mr-auto'>No rooms Available</span> : (
            <RoomsList rooms={rooms} />
          )}
        </div>
        {/* Footer pinned to bottom */}
        <footer className="mt-auto">
          <Footer roomName={roomName} setRoomName={setRoomName} />
        </footer>
      </div>
    </div>
  )
}

export default Home
