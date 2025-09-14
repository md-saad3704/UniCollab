import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { format } from "date-fns";

// Connect to backend
const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"], // fallback ensures connection
});

socket.on("connect", () => console.log("WS connected:", socket.id));

const ChatMessage = ({ msg, isOwn }) => (
  <div
    className={`p-2 rounded-lg max-w-xs break-words ${
      isOwn ? "bg-cyan-500 text-white ml-auto" : "bg-gray-700 text-white"
    }`}
  >
    <div>{msg.text}</div>
    <div className="text-xs text-gray-300 mt-1">
      {format(new Date(msg.time), "HH:mm")}
    </div>
  </div>
);

const Chat = ({ userId, chatWithId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!userId || !chatWithId) return;

    const room = `${Math.min(userId, chatWithId)}_${Math.max(
      userId,
      chatWithId
    )}`;
    socket.emit("join_room", { from: userId, to: chatWithId });

    // Fetch chat history
    axios
      .get(`http://localhost:5000/api/messages/${userId}/${chatWithId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch messages:", err));

    // Listen for incoming messages
    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [userId, chatWithId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = { from: userId, to: chatWithId, text };
    socket.emit("send_message", msg);
    setMessages((prev) => [
      ...prev,
      { ...msg, time: new Date().toISOString() },
    ]);
    setText("");
  };

  return (
    <div className="flex flex-col h-full border border-gray-600 rounded-md overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-auto p-2 space-y-2 bg-gray-900">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} msg={msg} isOwn={msg.from === userId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex border-t border-gray-700">
        <input
          type="text"
          className="flex-1 p-2 bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-cyan-500 px-4 text-white font-medium hover:bg-cyan-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
