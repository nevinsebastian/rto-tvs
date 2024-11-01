import React from 'react';

const DocumentScanner = ({ onCapture, onClose, photoType }) => {

  // Set bounding box size based on the type of photo being captured





 

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convert the file to a blob and pass it to the onCapture callback
        fetch(reader.result)
          .then(res => res.blob())
          .then(blob => onCapture(blob));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="out">
     


      {/* File input for uploading images */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} 
        style={{ marginTop: '10px' }} 
      />

      <div className="button-container">
        <button type="button" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default DocumentScanner;
