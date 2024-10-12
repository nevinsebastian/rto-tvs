import React, { useState } from 'react';
import ExpandMoreSharpIcon from '@mui/icons-material/ExpandMoreSharp';

const StatusButtons = ({ onButtonClick }) => {
  const [expanded, setExpanded] = useState(false); // Toggle state for buttons

  const buttons = ['All', 'Waiting for data', 'To verify', 'Verified', 'Registered', 'Add New'];

  const handleExpandClick = () => {
    setExpanded(!expanded); // Toggle expand/collapse
  };

  return (
    <div className="status-buttons-container">
      <div className="expand-icon" onClick={handleExpandClick}>
        <ExpandMoreSharpIcon style={{ fontSize: '30px', cursor: 'pointer' }} />
      </div>

      {expanded && (
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
