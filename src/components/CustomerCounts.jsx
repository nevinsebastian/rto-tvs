import React from 'react';

const CustomerCounts = ({ counts }) => {
  return (
    <div className="insights">
      {Object.entries(counts).map(([key, value]) => (
        <div className="insight-box" key={key}>
          <h2>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</h2>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerCounts;
