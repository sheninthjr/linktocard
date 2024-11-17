import React, { useState, useEffect } from 'react';
import './LiveUser.css';

const LiveUser = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'userCount') {
        setUserCount(data.payload);
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <span
      className="font-bold text-lg font-roboto p-2 flex w-fit rounded-xl self-center bg-white"
      style={{
        color: '#90EE90',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          fontSize: '52px',
          color: '#90EE90',
        }}
        className="animate-pulse"
      >
        •
      </span>
      <span className="text-black ml-2">Active User: {userCount}</span>
    </span>
  );
};

export default LiveUser;
