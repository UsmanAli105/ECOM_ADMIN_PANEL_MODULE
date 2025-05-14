import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import DashboardLayout from "./DashboardLayout";
import ReactMarkdown from 'react-markdown';

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    const newMessage: Message = {
      sender: "user",
      text: messageInput,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
    setLoading(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem('token') || '';


    try {
      const response = await axios.post("http://localhost:5000/ask", {
        user_id: user.userId,
        token: token,
        message: messageInput,
      });

const botMessage: Message = {
  sender: "bot",
  text:
    typeof response.data.response === "object"
      ? response.data.response.output || "No response"
      : response.data.response,
};


      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong, please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ height: "80vh", width: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Chat Bubble Container */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#f0f0f0",
          }}
        >
{messages.map((msg, idx) => (
  <div
    key={idx}
    style={{
      display: "flex",
      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
      marginBottom: "10px",
    }}
  >
    <div
      style={{
        padding: "12px 16px",
        borderRadius: "18px",
        backgroundColor: msg.sender === "user" ? "#0084ff" : "#e0e0e0",
        color: msg.sender === "user" ? "white" : "black",
        maxWidth: "75%",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        textAlign: msg.sender === "user" ? "right" : "left",
      }}
    >
      <ReactMarkdown>{msg.text}</ReactMarkdown>
    </div>
  </div>
))}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Area */}
        <div
          style={{
            display: "flex",
            padding: "15px",
            borderTop: "1px solid #ccc",
            backgroundColor: "white",
          }}
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              marginRight: "10px",
              fontSize: "16px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "12px 20px",
              borderRadius: "20px",
              backgroundColor: "#0084ff",
              color: "white",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
