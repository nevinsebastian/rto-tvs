import React, { useState } from 'react';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp'; // Import the MUI icon

const StatusButtons = ({ onButtonClick }) => {
  const [showButtons, setShowButtons] = useState(false); // State to toggle buttons
  const buttons = ['All', 'Waiting for data', 'To verify', 'Verified', 'Registered', 'Add New'];

  const handleIconClick = () => {
    setShowButtons((prevState) => !prevState); // Toggle the button display
  };

  return (
    <div className="status-buttons-container">
      <div className="status-icon" onClick={handleIconClick}>
        <ExpandMoreSharpIcon style={{ transform: showButtons ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
      </div>
      {showButtons && (
        <div className="status-buttons">
          {buttons.map((label) => (
            <button key={label} className="status-button" onClick={onButtonClick}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusButtons;
