const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'si2.html'));
});

app.post('/upload', (req, res) => {
    let data = [];
    req.on('data', chunk => {
        data.push(chunk);
    });

    req.on('end', () => {
        const buffer = Buffer.concat(data);
        const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
        const parts = buffer.split(Buffer.from(`--${boundary}`));

        parts.forEach(part => {
            const contentDisposition = part.indexOf('Content-Disposition: form-data; name="video"; filename="video.mp4"');
            if (contentDisposition !== -1) {
                const start = part.indexOf('\r\n\r\n') + 4;
                const end = part.lastIndexOf('\r\n');
                const videoBuffer = part.slice(start, end);

                // Save the video
                const filePath = path.join(__dirname, 'uploads', 'video.mp4');
                fs.writeFile(filePath, videoBuffer, err => {
                    if (err) {
                        return res.status(500).send({ message: 'Failed to save file' });
                    }
                    res.send({ message: 'File uploaded successfully' });
                });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

