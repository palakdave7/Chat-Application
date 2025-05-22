import React, { useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chat');
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return <div>ChatPage</div>;
};

export default ChatPage;
