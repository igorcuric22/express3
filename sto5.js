const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploads1')) {
    fs.mkdirSync('uploads1');
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON bodies (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sto5.html'));
});

// Route to handle file upload
app.put('/api/upload', (req, res) => {
    const STREAM_NAME = req.body.name || `${Date.now()}.webm`;
    const CHUNK_NUMBER = req.body.chunk || 0;
    const filePath = path.join(__dirname, 'uploads1', `${STREAM_NAME}_chunk_${CHUNK_NUMBER}.webm`);

    const writeStream = fs.createWriteStream(filePath);
    
    req.pipe(writeStream);
    
    req.on('end', () => {
        console.log(`Chunk ${CHUNK_NUMBER} uploaded successfully.`);
        res.status(200).send('Chunk uploaded successfully.');
    });

    req.on('error', (err) => {
        console.error('Error uploading chunk:', err);
        res.status(500).send('Error uploading chunk.');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
