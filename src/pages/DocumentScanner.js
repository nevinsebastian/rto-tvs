import React, { useRef, useEffect, useState, useCallback } from 'react';

const DocumentScanner = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const captureImage = useCallback(() => {
    setIsCapturing(true);

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
      offsetX,
      offsetY,
      boundingBoxWidth,
      boundingBoxHeight,
      0,
      0,
      boundingBoxWidth,
      boundingBoxHeight
    );

    canvas.toBlob((blob) => {
      onCapture(blob); // Trigger the parent callback

      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl); // Set preview image
      setIsCapturing(false);
    }, 'image/jpeg');
  }, [onCapture]);

  const retakeImage = () => {
    setPreview(null); // Clear the preview and allow retake
    setIsCapturing(false); // Allow capturing again
  };

  return (
    <div className="out">
      <div className="camera-container">
        {!preview ? (
          <>
            <video ref={videoRef} className="camera-view" playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="bounding-box">
              <p>Align Aadhaar front in this box</p>
            </div>
          </>
        ) : (
          <div className="image-preview">
            <h3>Captured Image Preview:</h3>
            <img src={preview} alt="Preview" />
            <button type="button" onClick={retakeImage}>
              Retake Image
            </button>
          </div>
        )}
        <div className="button-container">
          <button type="button" onClick={onClose}>
            Close Camera
          </button>
        </div>
      </div>
      
      <button type="button" onClick={captureImage}>New Button</button> {/* Updated: New Button for capturing */}
    </div>
  );
};

export default DocumentScanner;
