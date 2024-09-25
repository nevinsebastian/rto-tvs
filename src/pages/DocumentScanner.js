import React, { useRef, useEffect } from 'react';

const DocumentScanner = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!streamRef.current) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          streamRef.current = mediaStream;
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
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

    const boundingBox = {
      x: 0, // Position of bounding box relative to video (0 for centering)
      y: 0, // Position of bounding box relative to video (0 for centering)
      width: 300, // Width of the bounding box
      height: 200, // Height of the bounding box
    };

    // Set canvas dimensions to match the bounding box
    canvas.width = boundingBox.width;
    canvas.height = boundingBox.height;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Calculate scaling factors
    const scaleX = videoWidth / video.clientWidth; // Scaling based on video client size
    const scaleY = videoHeight / video.clientHeight; // Scaling based on video client size

    // Calculate the actual dimensions to use for drawing
    const drawWidth = boundingBox.width * scaleX;
    const drawHeight = boundingBox.height * scaleY;

    // Draw the video frame onto the canvas
    context.drawImage(
      video,
      boundingBox.x * scaleX, // Start drawing from the scaled bounding box position
      boundingBox.y * scaleY, // Start drawing from the scaled bounding box position
      drawWidth, // Use the calculated width
      drawHeight, // Use the calculated height
      0, // X position on the canvas
      0, // Y position on the canvas
      boundingBox.width, // Width to draw on canvas
      boundingBox.height // Height to draw on canvas
    );

    // Convert the canvas to a blob
    canvas.toBlob((blob) => {
      onCapture(blob); // Trigger the parent callback with the captured image blob
    }, 'image/jpeg');
  };

  return (
    <div className="out">
      <div className="camera-container">
        <video ref={videoRef} className="camera-view" playsInline muted />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className="bounding-box" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px', // Guiding box width
          height: '200px', // Guiding box height
          transform: 'translate(-50%, -50%)',
          border: '2px dashed #00FF00',
          pointerEvents: 'none',
        }}>
          <p style={{
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px',
            borderRadius: '5px',
            margin: 0,
          }}>Align Aadhaar front in this box</p>
        </div>
      </div>
      <button type="button" onClick={captureImage}>Capture</button>
      <div className="button-container">
        <button type="button" onClick={onClose}>
          Close Camera
        </button>
      </div>
    </div>
  );
};

export default DocumentScanner;
