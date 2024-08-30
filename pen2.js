// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const port = 3000;

// Serve the frontend
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pen1.html'));
  });

app.post('/upload', (req, res) => {
    const filePath = `uploads/${Date.now()}-videox.webm`;
    const fileStream = fs.createWriteStream(filePath);

    req.pipe(fileStream);

    req.on('end', () => {
        res.send('Video uploaded successfully!');
    });

    req.on('error', (err) => {
        console.error('Error during file upload', err);
        res.status(500).send('Error during file upload');
    });
   
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
