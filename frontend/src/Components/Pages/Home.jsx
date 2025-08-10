import React from 'react'
import homeBg from '../../assets/home-bg.jpeg'
import NameField from '../nameField'
import Footer from '../Footer'

const Home = () => {
  return (
    <div
      style={{ backgroundImage: `url(${homeBg})` }}
      className="flex justify-center h-screen bg-center"
    >
      <div className="flex flex-col justify-between border-4 w-full max-w-md m-10 rounded-4xl border-[#895b03] bg-[#eeb953] p-6">
        
        {/* Header */}
        <header>
          <NameField />
        </header>

        {/* Footer pinned to bottom */}
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </div>
  )
}

export default Home
