import express from 'express';
import cors from 'cors';
import * as PlayHT from 'playht';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Initialize PlayHT with your API key and user ID
PlayHT.init({
  apiKey: process.env.API_KEY,
  userId: process.env.USER_ID,
});

// Enable CORS for the frontend running on port 3000
app.use(cors({
  origin: process.env.ORIGIN,  // Allow requests only from the frontend running on port 3000
}));

// Middleware to parse JSON requests
app.use(express.json());

// POST endpoint to generate audio from text and file URL
app.post('/api/synthesize', async (req, res) => {
  const { text } = req.body;

  console.log(req.body);

  if (!text) {
    return res.status(400).json({ error: 'Both fileUrl and text are required' });
  }

  try {
    // Generate audio from text using PlayHT
    const generated = await PlayHT.generate(text);

    // Return the audio URL to the frontend
    const { audioUrl } = generated;
    return res.json({ audioUrl });
  } catch (error) {
    console.error('Error during synthesis:', error.message);
    return res.status(500).json({ error: 'Failed to generate audio' });
  }
});

// Set server to run on port 4000
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
