// components/ChatWindow.tsx

// components/ChatWindow.tsx
"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  // ... (unchanged code)
  useEffect(() => {
    const interval = setInterval(() => {
      receiveMessage("Hello! How can I help you?");
    }, 5000); // Simulating a message every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === "") {
      return;
    }
  
    // Add the user's message to the messages array
    sendMessage(newMessage);
  
    // Clear the input field
    setNewMessage("");
  
    try {
      // Make a GET request to the specified URL with query parameters
      const userId = "tPAS3CycNiaMHk8DB6YvsBuClSA3"; // Replace with your user ID
      const queryParams = new URLSearchParams({ tag: newMessage, id: userId });
  
      const response = await fetch(`https://7638-34-70-22-243.ngrok-free.app?${queryParams}`);
      if (response.ok) {
        const responseData = await response.json();
        // Render the response message from the API
        receiveMessage(responseData.message);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to add a user message to the messages array
  const sendMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
  };

  // Function to add a received message to the messages array
  const receiveMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, `Chatbot: ${message}`]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-gray-500 p-4 rounded-md mb-4 w-80">
        <button
          className="float-right text-white"
          onClick={onClose}
        >
          X
        </button>
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            {message}
          </div>
        ))}
      </div>
      <form className="flex" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          className="p-2 border rounded-l-md w-64"
          value={newMessage}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;



















/*


"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  // Simulate incoming messages from the chatbot
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-gray-500 p-4 rounded-md mb-4 w-80">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            {message}
          </div>
        ))}
      </div>
      <form className="flex" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          className="p-2 border rounded-l-md w-64"
          value={newMessage}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;*/
