import React, { useEffect,useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [chats, setChats] =useState([]);
  const fetchChats = async () => {
    const { data } = await axios.get('/api/chat');
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return <div>
    {
      chats.map((chat) => (
  
          <div key={chat._id}>{chat.chatName}</div>
          //key is used to give a unique identity to each element in the list
      ))
    
      /* This is where you can render the chat list or any other UI components */ 
      // to write javascript inside html we use curly braces

    }
  </div>;
};

export default ChatPage;
