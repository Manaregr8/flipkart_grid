"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/navbar";
import "./home.css"; // Assuming you have custom CSS

export default function Home() {
  const videoRef = useRef(null);
  const [output, setOutput] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image
  const [isCameraMode, setIsCameraMode] = useState(true); // Toggle between camera and upload

  useEffect(() => {
    if (isCameraMode) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Error accessing camera: ", err);
        }
      };

      startCamera();

      return () => {
        if (videoRef.current) {
          const stream = videoRef.current.srcObject;
          if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
          }
        }
      };
    }
  }, [isCameraMode]); // Restart camera when switching back

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

  return (
    <div className="container">
      <Navbar />
      <main className="content">
        <div className="media-container">
          {isCameraMode ? (
            <video
              ref={videoRef}
              className="media"
              autoPlay
              playsInline
            />
          ) : uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="media"
            />
          ) : null}
        </div>

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
