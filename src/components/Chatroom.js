import React, { useState, useEffect, useContext } from 'react';


function ChatRoom(account) {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Subscribe to the chat room messages using the user's account
  }, [account]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send the message to the chat room contract
    setMessage('');
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.sender}: {msg.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" className="text-black" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
export default ChatRoom;