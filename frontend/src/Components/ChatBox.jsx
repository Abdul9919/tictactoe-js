import React from "react";

const ChatBox = () => {
  return (
    <div className="p-4 bg-[#eeb953] border-t border-[#895b03]">
      <div className="h-24 overflow-y-auto bg-[#f5d17a] border border-[#895b03] rounded-lg p-2 mb-2 text-sm">
        {/* Messages will be shown here */}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-l-lg border border-[#895b03] outline-none"
        />
        <button className="bg-[#895b03] text-white px-4 rounded-r-lg hover:bg-[#a86f04] transition-colors">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
