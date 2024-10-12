import React from 'react';

const StatusButtons = ({ onButtonClick }) => {
  const buttons = ['All', 'Pending', 'Submitted', 'Add New'];
  
  return (
    <div className="status-buttons-container">
      {buttons.map((label) => (
        <button key={label} className="status-button" onClick={onButtonClick}>
          {label}
        </button>
      ))}
    </div>
  );
};

export default StatusButtons;
