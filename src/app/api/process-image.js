import formidable from 'formidable';
import { exec } from 'child_process';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Error parsing the image.' });
      }

      const imagePath = files.image.filepath; // Assuming the image is passed correctly
      console.log("Image Path:", imagePath); // Debugging log

      // Call the Python script with the image path
      exec(`python tesseract.py ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${stderr}`);
          return res.status(500).json({ error: stderr });
        }
        console.log(`Python Output: ${stdout}`); // Debug the Python output
        res.status(200).json({ output: stdout });
      });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
