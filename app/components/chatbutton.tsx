// components/ChatBotButton.tsx
"use client";
import React, { useState } from "react";
import ChatWindow from "../components/chatbot";

const ChatBotButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        className="bg-blue-500 text-white p-3 rounded-full"
        onClick={toggleChat}
      >
        <span role="img" aria-label="Chat Icon" style={{ fontSize: "1.5em" }}>
          💬 Help
        </span>
      </button>
      {isChatOpen && <ChatWindow onClose={closeChat} />}
    </div>
  );
};

export default ChatBotButton;
