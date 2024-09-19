import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import './styles/WebcamCapture.css';  // Assuming you have a CSS file for styling

const WebcamCapture = ({ type, onCapture }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isRetake, setIsRetake] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsRetake(true);
  };

  const handleConfirm = () => {
    onCapture(capturedImage);  // Send the captured image back to the parent component
  };

  return (
    <div className="webcam-container">
      {!capturedImage ? (
        <>
          <div className="webcam-overlay">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: { ideal: "environment" }  // Back camera
              }}
              className="webcam-feed"
            />
            <div className={`overlay-box ${type}`} />
            {/* The overlay box class controls the type of frame shown (Aadhaar, Passport) */}
          </div>
          <button className="capture-btn" onClick={capture}>Capture</button>
        </>
      ) : (
        <div className="preview-container">
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <div className="preview-actions">
            <button className="retake-btn" onClick={retakePhoto}>Retake</button>
            <button className="confirm-btn" onClick={handleConfirm}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
