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
        src="/rr310.jpg"
        alt="Funny Lost Gif"
        className="not-found-gif"
      />
      <Link to="/login" className="back-home">
        Get me back home!
      </Link>
    </div>
  );
};

export default NotFound;
