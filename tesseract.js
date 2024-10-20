// components/OcrComponent.js
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import sharp from 'sharp'; // optional, if you want to preprocess images

const OcrComponent = () => {
  const [imageFile, setImageFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const processImage = async (file) => {
    setProcessing(true);
    
    try {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = async () => {
        const image = fileReader.result;

        // Optionally preprocess the image (similar to OpenCV in Python)
        // You can use sharp here to resize, grayscale, or blur the image, if needed

        // Perform OCR using Tesseract.js
        const { data: { text } } = await Tesseract.recognize(image, 'eng', {
          logger: (m) => console.log(m), // Log progress
        });

        setOcrResult(text);
        setProcessing(false);
      };
    } catch (error) {
      console.error('Error during OCR:', error);
      setProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageFile) {
      processImage(imageFile);
    }
  };

  return (
    <div>
      <h2>Image to Text Converter (OCR)</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={!imageFile || processing}>
          {processing ? 'Processing...' : 'Convert Image'}
        </button>
      </form>
      
      {ocrResult && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{ocrResult}</p>
        </div>
      )}
    </div>
  );
};

export default OcrComponent;
