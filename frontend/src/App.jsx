import React from 'react'
import './App.css'
// import { io } from 'socket.io-client'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './Components/Pages/Home'

function App() {
  // const socket = io('http://localhost:8080')
  
  // useEffect(() => {
  //   socket.emit('sendMsg', 'connected to socket server')
  // }, [socket])

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
