import React from 'react'

const Footer = () => {
    return (
        <div>
        <h2 className="text-center text-xl font-bold text-[#845115] mb-2">
            Create Room
        </h2>
            <input
                type="text"
                placeholder="Enter room name"
                className="ml-[23%] px-4 py-2 rounded-lg border border-[#895b03] focus:outline-none focus:ring-2 focus:ring-[#c49a30]
             bg-[#fffaf0] text-[#333]"
            />

        </div>
    )
}

export default Footer