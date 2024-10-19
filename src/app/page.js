"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/navbar";
import "./home.css"; // Assuming you have custom CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRotate } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const videoRef = useRef(null);
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
    // Additional processing code can go here (e.g., capturing image from video or uploaded image)
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
            <img src={uploadedImage} alt="Uploaded" className="media" />
          ) : null}
        </div>
        <button onClick={swapCamera} className="swap-btn">
          <FontAwesomeIcon icon={faCameraRotate} />
          </button>
        {/* Buttons */}
        <div className="button-container">

          <form onSubmit={handleSubmit} className="form-container">
            <button type="submit" className="btn submit-btn">
              Capture
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
