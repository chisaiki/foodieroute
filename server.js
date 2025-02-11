require('dotenv').config(); // Load .env file

const express = require('express');
const path = require('path');
const app = express();
const port = 8000; // You can change this to any port

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// API route to send API key
app.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.API_KEY });
});

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
