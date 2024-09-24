import React, { useRef, useEffect, useState } from 'react';

const DocumentScanner = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Use back camera
        });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startCamera();

    return () => {
      // Stop the camera stream when the component unmounts to prevent memory leaks
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions equal to the video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a Blob and pass it back
    canvas.toBlob((blob) => {
      onCapture(blob);
    }, 'image/jpeg');
  };

  return (
    <div className="camera-container">
      <video ref={videoRef} className="camera-view" autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="bounding-box">
        <p>Align Aadhaar front in this box</p>
      </div>
      <button type="button" onClick={captureImage}>Capture Aadhaar Front</button>
      <button type="button" onClick={onClose}>Close Camera</button>
    </div>
  );
};

export default DocumentScanner;
