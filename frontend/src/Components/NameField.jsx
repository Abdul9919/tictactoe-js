import React from 'react'

const NameField = () => {
  return (
    <div className='m-4'>
        <form className='flex flex-col items-center  p-4'>
            <label htmlFor="name" className='font-serif font-bold text-2xl text-[#895b03]'>Enter Your Name</label>
            <input type="text" id="name" placeholder="Enter your name" className='px-4 py-2 my-2 rounded-lg border border-[#895b03]
             focus:outline-none focus:ring-2 focus:ring-[#c49a30] bg-[#fffaf0] text-[#333]' />
        </form>
    </div>
  )
}

export default NameField