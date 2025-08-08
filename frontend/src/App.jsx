import React, { useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client'

function App() {
  const socket = io('http://localhost:8080')
  
  useEffect(() => {
    socket.emit('sendMsg', 'connected to socket server')
  }, [socket])

  return (
    <>
    </>
  )
}

export default App
