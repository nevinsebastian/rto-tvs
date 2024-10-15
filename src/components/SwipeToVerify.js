import React, { useState, useEffect, useRef } from 'react';
import '../styles/SwipeToVerify.css';
import Confetti from 'react-confetti';

const SwipeToVerify = ({ onComplete }) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const swipeContainerRef = useRef(null);
  const buttonWidth = 50;  // Width of the swipe button

  // Handle window resize for confetti size
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = (e) => {
    setIsDragging(true);
  };

  const handleDrag = (e) => {
    if (!isDragging || isSwiped) return;
    const container = swipeContainerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Calculate the new drag position
    let newPosition = e.clientX - containerRect.left - buttonWidth / 2;

    // Ensure the swipe button stays within the bounds of the container
    if (newPosition < 0) newPosition = 0;
    if (newPosition > containerRect.width - buttonWidth) {
      newPosition = containerRect.width - buttonWidth;
    }

    setDragPosition(newPosition);
  };

  const handleDragEnd = () => {
    const container = swipeContainerRef.current;
    const containerWidth = container.getBoundingClientRect().width;

    if (dragPosition >= containerWidth - buttonWidth - 10) {
      // Successfully swiped
      setIsSwiped(true);
      setConfettiVisible(true);
      setTimeout(() => {
        setConfettiVisible(false);
        onComplete();  // Trigger verification completion
      }, 3000);
    } else {
      // Reset position if not fully swiped
      setDragPosition(0);
    }

    setIsDragging(false);
  };

  return (
    <div
      className={`swipe-container ${isSwiped ? 'swiped' : ''}`}
      ref={swipeContainerRef}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <span className="swipe-text">Swipe to Verify</span>
      <div
        className={`swipe-button ${isDragging ? 'dragging' : ''}`}
        style={{ transform: `translateX(${dragPosition}px)` }}
        onMouseDown={handleDragStart}
      ></div>

      {confettiVisible && (
        <div className="confetti-container">
          <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} />
        </div>
      )}
    </div>
  );
};

export default SwipeToVerify;


