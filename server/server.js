require('dotenv').config({ path: __dirname + '/.env' }); // Load .env from /server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8000;

// Enable CORS (optional, only needed if serving frontend from a different origin)
app.use(cors());

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, '../public')));

// API route to send the API key
app.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
