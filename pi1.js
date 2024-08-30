const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse multipart/form-data
app.use(bodyParser.raw({ type: 'video/mp4', limit: '50mb' }));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Endpoint to handle video upload
app.post('/upload', (req, res) => {
    const videoPath = path.join(uploadDir, `video_${Date.now()}.mp4`);

    fs.writeFile(videoPath, req.body, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'Failed to save video' });
        } else {
            res.json({ message: 'Video saved successfully', videoPath });
        }
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','pi1.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
