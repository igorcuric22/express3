const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(bodyParser.raw({ type: 'video/webm', limit: '50mb' }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ko3.html'));
  });




// Endpoint to handle video upload
app.post('/upload', (req, res) => {
    const videoPath = path.join(uploadsDir, 'webcam-video.webm');
    fs.writeFile(videoPath, req.body, err => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Failed to save video');
        }
        res.sendStatus(200);
    });
});

// Endpoint to serve the video
app.get('/video', (req, res) => {
    const videoPath = path.join(uploadsDir, 'webcam-video.webm');
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send('Video not found');
    }
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/webm',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/webm',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
