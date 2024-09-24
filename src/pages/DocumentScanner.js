import React, { useRef, useEffect, useState, useCallback } from 'react';

const DocumentScanner = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);  // Store the stream in a ref to persist across renders
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!streamRef.current) {
          // Only start the camera if it's not already running
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          });
          streamRef.current = mediaStream;  // Store stream in ref
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
        streamRef.current.getTracks().forEach(track => track.stop());  // Stop stream on unmount
      }
    };
  }, []);

  const captureImage = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    const boundingBoxWidth = 300;
    const boundingBoxHeight = 200;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const offsetX = (videoWidth - boundingBoxWidth) / 2;
    const offsetY = (videoHeight - boundingBoxHeight) / 2;

    canvas.width = boundingBoxWidth;
    canvas.height = boundingBoxHeight;

    context.drawImage(
      video,
      offsetX, offsetY,
      boundingBoxWidth, boundingBoxHeight,
      0, 0,
      boundingBoxWidth, boundingBoxHeight
    );

    canvas.toBlob((blob) => {
      onCapture(blob);

      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);
    }, 'image/jpeg');
  }, [onCapture]);

  return (
    <div className="camera-container">
      <video ref={videoRef} className="camera-view" playsInline muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="bounding-box">
        <p>Align Aadhaar front in this box</p>
      </div>
      <button type="button" onClick={captureImage}>Capture Aadhaar Front</button>
      <button type="button" onClick={onClose}>Close Camera</button>

      {preview && (
        <div className="image-preview">
          <h3>Captured Image Preview:</h3>
          <img src={preview} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default DocumentScanner;
