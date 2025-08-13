import React from 'react'
import './App.css'
// import { io } from 'socket.io-client'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './Components/Pages/Home'
import Room from './Components/Pages/Room'
import { SocketProvider } from './Contexts/SocketContext'

function App() {
  // const socket = io('http://localhost:8080')
  
  // useEffect(() => {
  //   socket.emit('sendMsg', 'connected to socket server')
  // }, [socket])

  return (
    <>
    <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomName" element={<Room />} />
      </Routes>
    </BrowserRouter>
    </SocketProvider>
    </>
  )
}

export default App
