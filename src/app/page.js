"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/navbar";
import "./home.css"; // Assuming you have custom CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRotate } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the canvas element
  const [output, setOutput] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image
  const [isCameraMode, setIsCameraMode] = useState(true); // Toggle between camera and upload
  const [facingMode, setFacingMode] = useState("user"); // Set initial camera to front

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }, // Set the camera direction based on facingMode state
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  useEffect(() => {
    if (isCameraMode) {
      startCamera();
      return () => {
        if (videoRef.current) {
          const stream = videoRef.current.srcObject;
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
          }
        }
      };
    }
  }, [isCameraMode, facingMode]); // Restart camera when switching between modes or swapping camera

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
  
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
  
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
      const imageData = canvas.toDataURL("image/png");
  
      setUploadedImage(imageData);
  
      const response = await fetch("/api/process-image", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData }),
      });
  
      const result = await response.json();
      console.log("Backend OCR Output:", result);
  
      setOutput(result.output);
    }
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); // Set uploaded image to be displayed
        setIsCameraMode(false); // Switch to uploaded image mode
      };
      reader.readAsDataURL(file);
    }
  };

  const switchToCameraMode = () => {
    setUploadedImage(null); // Clear uploaded image
    setIsCameraMode(true); // Switch to camera feed
  };

  const swapCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user")); // Swap between front and back
  };

  return (
    <div className="container">
    <Navbar />
    <main className="content">
      <div className="media-container">
        {isCameraMode ? (
          <video ref={videoRef} className="media" autoPlay playsInline />
        ) : uploadedImage ? (
          <img src={uploadedImage} alt="Captured" className="media" />
        ) : null}
      </div>

      {/* Hidden canvas used to capture the image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <button onClick={swapCamera} className="swap-btn">
        <FontAwesomeIcon icon={faCameraRotate} />
      </button>

      {/* Form to submit the image */}
      <div className="button-container">
        <form onSubmit={handleSubmit} className="form-container">
          <button type="submit" className="btn submit-btn">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </div>

      {/* Display the OCR output */}
      {output && (
        <div className="output-container">
          <h3>OCR Results:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </main>
  </div>
  );
}
