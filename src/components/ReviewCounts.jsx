import React from 'react';

const ReviewCounts = ({ reviewCounts }) => {
  return (
    <div className="review-container">
      {Object.entries(reviewCounts).map(([key, value]) => (
        <div className="insight-box" key={key}>
          <h2>{key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</h2>
          <p>{value}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewCounts;
