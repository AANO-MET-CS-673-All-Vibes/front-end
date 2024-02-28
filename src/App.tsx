// import Message from './Message';
import React from 'react';
import LoginForm from './LoginForm';
// import Message from './Message.tsx'

// function Writing() {
//   return <div><Message></Message></div>
// }

const App: React.FC = () => {
  return (
    <div>
      <h1 id="logo">allvibes</h1>
      <LoginForm></LoginForm >
    </div>
  );
};

export default App;