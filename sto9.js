const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploadx3')) {
    fs.mkdirSync('uploadx3');
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sto9.html'));
});

app.put('/api/upload', (req, res) => {
    const STREAM_NAME = req.headers['x-stream-name'] || `${Date.now()}.webm`;
    const CHUNK_NUMBER = parseInt(req.headers['x-chunk-number']) || 0;

    const filePath = path.join(__dirname, 'uploadx3', `${STREAM_NAME}_chunk_${CHUNK_NUMBER}.webm`);

    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    writeStream.on('finish', () => {
        console.log(`Chunk ${CHUNK_NUMBER} of ${STREAM_NAME} uploaded successfully.`);
        res.status(200).send('Chunk uploaded successfully.');
    });

    writeStream.on('error', (err) => {
        console.error(`Error uploading chunk ${CHUNK_NUMBER} of ${STREAM_NAME}:`, err);
        res.status(500).send('Error uploading chunk.');
    });

    req.on('error', (err) => {
        console.error(`Request error for chunk ${CHUNK_NUMBER} of ${STREAM_NAME}:`, err);
        res.status(500).send('Error uploading chunk.');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
