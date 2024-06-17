// ImageViewer.js
import React, { useEffect, useState, useContext } from 'react';
import MyNavbar from './MyNavbar.js';

const ImageViewer = () => {

    const [username, setUsername] = useState('');
    
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      }, []);
  return (
    <div>
      <MyNavbar username={username} />
      <img src="/images/wireframe.jpg" alt="Wireframe" />
    </div>
  );
};

export default ImageViewer;
