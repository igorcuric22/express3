const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.raw({ type: 'video/webm', limit: '50mb' }));

let videoChunks = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ko6.html'));
});


// Endpoint to handle video chunk upload
app.post('/upload', (req, res) => {
    videoChunks.push(req.body);
    res.sendStatus(200);
});

// Endpoint to serve the video
app.get('/video', (req, res) => {
    if (videoChunks.length === 0) {
        return res.status(404).send('No video available');
    }

    const videoBuffer = Buffer.concat(videoChunks);
    res.writeHead(200, {
        'Content-Length': videoBuffer.length,
        'Content-Type': 'video/webm',
    });
    res.end(videoBuffer);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
