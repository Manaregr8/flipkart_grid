import formidable from 'formidable';
import fs from 'fs';
import { exec } from 'child_process';

// Disable the body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to run the Python Tesseract script
function runPythonScript(imagePath) {
  return new Promise((resolve, reject) => {
    exec(`python3 tesseract.py ${imagePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(stderr);
      }
      resolve(stdout);
    });
  });
}

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Error parsing form data' });
    }

    const imagePath = files.image.filepath; // Get the uploaded image path

    try {
      // Call the Python script to process the image
      const result = await runPythonScript(imagePath);
      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ error: 'Error processing image with Tesseract' });
    }
  });
}
