import React, { useRef, useEffect } from 'react';

const DocumentScanner = ({ onCapture, onClose, photoType }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Set bounding box size based on the type of photo being captured
  const getBoundingBox = () => {
    switch (photoType) {
      case 'aadhaar_front':
      case 'aadhaar_back':
        return { width: 300, height: 200 }; // Aadhaar card size (landscape)
      case 'passport':
        return { width: 300, height: 400 }; // Passport photo size (portrait)
      default:
        return { width: 300, height: 200 }; // Default size
    }
  };

  const boundingBox = getBoundingBox();

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API is not supported in this browser.');
        }

        // Requesting higher resolution video
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', // Use back camera
            width: { ideal: 1280 }, // Set ideal width
            height: { ideal: 720 } // Set ideal height
          },
        });

        streamRef.current = mediaStream;
        videoRef.current.srcObject = mediaStream;

        // Wait for video to be ready before playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };

      } catch (error) {
        console.error('Camera access error:', error);
        alert(error.message); // Show the error message to the user
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    // Use the video dimensions directly
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Set canvas dimensions to match the bounding box
    canvas.width = boundingBox.width;
    canvas.height = boundingBox.height;

    // Draw the video frame onto the canvas
    context.drawImage(
      video,
      0, 0, // Start drawing from the top-left corner of the video
      videoWidth, videoHeight, // Use full video dimensions
      0, 0, // X position on canvas
      boundingBox.width, boundingBox.height // Width and height on canvas
    );

    // Convert the canvas to a blob (JPEG)
    canvas.toBlob((blob) => {
      onCapture(blob); // Trigger the parent callback with the captured image blob
    }, 'image/jpeg', 1.0); // Ensure quality is set to 1.0 for maximum quality
  };

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
      <div className="camera-container">
        <video ref={videoRef} className="camera-view" playsInline muted />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Dynamic bounding box based on the photo type */}
        <div
          className="bounding-box"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${boundingBox.width}px`,
            height: `${boundingBox.height}px`,
            transform: 'translate(-50%, -50%)',
            border: '2px dashed #00FF00',
            pointerEvents: 'none',
          }}
        >
          {/* Dynamic instructions */}
          <p
            style={{
              color: 'white',
              fontWeight: 'bold',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '5px',
              borderRadius: '5px',
              margin: 0,
            }}
          >
            {photoType === 'aadhaar_front' && 'Align Aadhaar Front in this box'}
            {photoType === 'aadhaar_back' && 'Align Aadhaar Back in this box'}
            {photoType === 'passport' && 'Align Your Face in this box'}
          </p>
        </div>
      </div>

      <button type="button" onClick={captureImage}>Capture</button>

      {/* File input for uploading images */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} 
        style={{ marginTop: '10px' }} 
      />

      <div className="button-container">
        <button type="button" onClick={onClose}>
          Close Camera
        </button>
      </div>
    </div>
  );
};

export default DocumentScanner;
