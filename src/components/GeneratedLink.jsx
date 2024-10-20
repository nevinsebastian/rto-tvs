import React from 'react';

const GeneratedLink = ({ link }) => {
  const linkContainerStyle = {
    marginTop: '30px', // Adjust this value to move the component down
  };

  return (
    <div style={linkContainerStyle}>
      <h3>Generated Link:</h3>
      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
    </div>
  );
};

export default GeneratedLink;
