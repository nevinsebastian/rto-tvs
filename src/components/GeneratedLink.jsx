import React from 'react';

const GeneratedLink = ({ link }) => {
  return (
    <div className="link-container">
      <h3>Generated Link:</h3>
      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
    </div>
  );
};

export default GeneratedLink;
  