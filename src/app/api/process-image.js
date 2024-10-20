import { createWorker } from 'tesseract.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided.' });
    }

    try {
      // Initialize the Tesseract worker
      const worker = await createWorker({
        logger: (m) => console.log(m), // Optional: Logs OCR progress
      });

      // Start the worker
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Perform OCR on the image
      const { data } = await worker.recognize(image);

      // Terminate the worker after processing
      await worker.terminate();

      // Return the OCR result
      return res.status(200).json({ output: data.text });
    } catch (error) {
      console.error('Error processing image with Tesseract:', error);
      return res.status(500).json({ error: 'OCR processing failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
