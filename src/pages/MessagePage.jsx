import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const MessagePage = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // Reference for auto-scrolling

  // Function to decode JWT manually
  const decodeToken = (token) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    return decoded; 
  };

  const authToken = localStorage.getItem("authToken");
  const decodedToken = decodeToken(authToken);
  const usId = decodedToken?.id;

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get("/contacts", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setContacts(response.data.contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }

    // Setup socket connection
    const socketInstance = io("http://localhost:5000", {
      auth: { token: authToken },
    });
    setSocket(socketInstance);

    fetchContacts(); // Fetch contacts when component is mounted

    return () => {
      socketInstance.disconnect(); // Clean up socket on unmount
    };
  }, [authToken, navigate]);

  useEffect(() => {
    if (selectedContact) {
      // Fetch messages with the selected contact
      axios
        .get(`/messages/${usId}/${selectedContact.contactId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setMessages(response.data);
        })
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [selectedContact, authToken]);

  useEffect(() => {
    if (selectedContact) {
      const interval = setInterval(() => {
        // Fetch the latest messages from the server every 3 seconds
        axios
          .get(`/messages/${usId}/${selectedContact.contactId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .then((response) => {
            setMessages(response.data);
          })
          .catch((err) => console.error("Error fetching messages:", err));
      }, 3000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [selectedContact, authToken]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const messageData = {
        senderId: usId,
        receiverId: selectedContact.contactId,
        content: newMessage,
      };

      // Optimistic UI Update: Add the message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, timestamp: new Date().toISOString() },
      ]);
      setNewMessage("");
      
      // Emit message to socket
      socket.emit("sendMessage", messageData);

      // Send message to server
      axios
        .post("/messages/send", messageData, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .catch((err) => console.error("Error sending message:", err));
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        if (
          message.senderId === selectedContact?.contactId ||
          message.receiverId === selectedContact?.contactId
        ) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }
  }, [socket, selectedContact]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar with Dashboard and Logout */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-4">
        <div className="flex space-x-4">
          <button
            onClick={goToDashboard}
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition"
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Panel: Contacts */}
        <div className="w-1/3 bg-gray-100 border-r overflow-y-auto p-4">
          <h2 className="text-xl font-bold border-b pb-2">Contacts</h2>
          <ul>
            {contacts.map((contact) => (
              <li
                key={contact.contactId}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 cursor-pointer rounded-lg mb-2 ${
                  selectedContact?._id === contact._id
                    ? "bg-blue-100"
                    : "hover:bg-blue-50"
                }`}
              >
                <p className="font-medium">{contact.name}</p>
                <small>{contact.lastMessage || "No messages yet"}</small>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Chat */}
        <div className="w-2/3 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-gray-200 border-b flex items-center">
                <h2 className="text-xl font-bold">{selectedContact.name}</h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.senderId === usId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          msg.senderId === usId
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        } max-w-sm`}
                      >
                        <p>{msg.content}</p>
                        <small className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} /> {/* Auto-scroll reference */}
              </div>

              {/* Input Box */}
              <div className="p-4 border-t bg-gray-100 flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
