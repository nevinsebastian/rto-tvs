// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css'; // For some funny styling

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>Oops! You got lost in the matrix!</h1>
      <p>Looks like this page doesn’t exist. Maybe try a different portal?</p>
      <img
        src="https://media.giphy.com/media/3o6fJ1BM7P1Xdl5sCw/giphy.gif"
        alt="Funny Lost Gif"
        className="not-found-gif"
      />
      <Link to="/" className="back-home">
        Get me back home!
      </Link>
    </div>
  );
};

export default NotFound;
