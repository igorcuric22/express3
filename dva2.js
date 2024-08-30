const express = require('express');
const fs = require('fs').promises; // Using promises version of fs
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = 'uploadsd3';

// Create 'uploads' directory asynchronously if it doesn't exist
fs.mkdir(path.join(__dirname, UPLOAD_DIR), { recursive: true })
    .catch(err => {
        console.error('Error creating upload directory:', err);
    });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dva2.html'));
});

// Middleware to parse incoming request bodies
app.use(express.raw({ limit: '10mb', type: 'video/webm' }));

// Handle video chunk uploads
app.put('/api/upload', async (req, res) => {
    const streamName = req.headers['x-stream-name'] || `${Date.now()}.webm`;
    const chunkNumber = parseInt(req.headers['x-chunk-number']) || 0;
    const filePath = path.join(__dirname, UPLOAD_DIR, `${streamName}_chunk_${chunkNumber}.webm`);

    console.log(`Received chunk ${chunkNumber} for stream ${streamName}, size: ${req.body.length} bytes`);

    try {
        if (req.body.length > 0) {
            // Write chunk to file using promises
            await fs.writeFile(filePath, req.body);

            console.log(`Chunk ${chunkNumber} of ${streamName} uploaded successfully.`);
            res.status(200).send('Chunk uploaded successfully.');
        } else {
            console.error(`Chunk ${chunkNumber} of ${streamName} is empty.`);
            res.status(400).send('Chunk is empty.');
        }
    } catch (err) {
        console.error(`Error writing chunk ${chunkNumber} of ${streamName}:`, err);
        res.status(500).send('Error writing chunk.');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

