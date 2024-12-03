"use client";
import { useRef, useState } from "react";
import { createWorker } from "tesseract.js";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [output, setOutput] = useState('');
  const [facingMode, setFacingMode] = useState("user"); // Default to front camera

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera: ", err);
    }
  };

  // Function to capture image and process it with Tesseract
  const captureAndProcessImage = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Capture frame from video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a data URL
    const imageDataURL = canvas.toDataURL("image/png");

    // Initialize Tesseract.js
    const worker = await createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    // Perform OCR
    const { data: { text } } = await worker.recognize(imageDataURL);
    setOutput(text);
    
    await worker.terminate();  // Clean up the worker
  };

  // Swap between front and back camera
  const swapCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  return (
    <div className="container">
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="button-container">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureAndProcessImage}>Capture & Process</button>
        <button onClick={swapCamera}>Swap Camera</button> {/* Swap Camera Button */}
      </div>

      {output && (
        <div className="output-container">
          <h3>OCR Results:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
