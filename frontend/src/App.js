import React from 'react';
import { Button } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className='App'>
      <Route path='/' component={Homepage} exact/>
      {/* exact used so that the homepage is only shown when the path is exactly '/'    */}
      <Route path='/chats' component={ChatPage}/>   
    </div>
  );
}

export default App;
