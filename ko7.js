// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3000;

// // Ensure the uploads directory exists
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir);
// }

// // Middleware to handle raw video/mp4 data
// app.use(bodyParser.raw({ type: 'video/mp4', limit: '50mb' }));

// // Array to store video chunks temporarily
// let videoChunks = [];

// // Serve your HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'ko7.html'));
// });

// // Endpoint to handle video chunk upload
// app.post('/upload', (req, res) => {
//     // Push received video chunk into the array
//     videoChunks.push(req.body);
//     res.sendStatus(200);
// });

// // Endpoint to serve the video
// app.get('/video', (req, res) => {
//     if (videoChunks.length === 0) {
//         return res.status(404).send('No video available');
//     }

//     // Concatenate all video chunks into a single Buffer
//     const videoBuffer = Buffer.concat(videoChunks);

//     // Write the concatenated buffer to a file on the server
//     const videoPath = path.join(uploadsDir, 'webcamx-video.mp4');
//     fs.writeFileSync(videoPath, videoBuffer);

//     // Get file stats (size)
//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;

//     // Handle HTTP range headers for streaming
//     const range = req.headers.range;
//     if (range) {
//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//         const chunksize = (end - start) + 1;
//         const file = fs.createReadStream(videoPath, { start, end });
//         const head = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp4',
//         };

//         res.writeHead(206, head);
//         file.pipe(res);
//     } else {
//         // If no range header, send the entire video file
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp4',
//         };
//         res.writeHead(200, head);
//         fs.createReadStream(videoPath).pipe(res);
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 3000;
// const DIRECTORY = 'upload17';

// // Create 'upload1' directory if it doesn't exist
// if (!fs.existsSync(DIRECTORY)) {
//     fs.mkdirSync(DIRECTORY);
// }

// // Middleware to parse form data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve the main page
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'ko7.html'));
// });

// let lastUploadedChunk = 1;

// // Handle video chunk uploads
// app.post('/upload', (req, res) => {
//     const data = [];
//     req.on('data', chunk => {
//         data.push(chunk);
//     }).on('end', () => {
//         const buffer = Buffer.concat(data);
//         const filePath = path.join(__dirname, DIRECTORY, `example_${lastUploadedChunk}.webm`);
//         fs.writeFile(filePath, buffer, (err) => {
//             if (err) {
//                 return res.status(500).send('Failed to upload video');
//             }
//             lastUploadedChunk++;
//             res.send('Video uploaded successfully!');
//         });
//     });
// });

// // Serve the uploaded video
// app.get('/video', (req, res) => {
//     const filePath = path.join(__dirname, DIRECTORY, `example_${lastUploadedChunk - 1}.webm`);
//     if (fs.existsSync(filePath)) {
//         res.sendFile(filePath);
//     } else {
//         res.status(404).send('No such file');
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DIRECTORY = 'upload1';

// Create 'upload1' directory if it doesn't exist
if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
}

// Middleware to parse form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ko7.html'));
});

let lastUploadedChunk = 1;

// Handle video chunk uploads
app.post('/upload/:filename', (req, res) => {
    const data = [];
    req.on('data', chunk => {
        data.push(chunk);
    }).on('end', () => {
        const buffer = Buffer.concat(data);
        const filePath = path.join(__dirname, DIRECTORY, req.params.filename);
        fs.writeFile(filePath, buffer, (err) => {
            if (err) {
                return res.status(500).send('Failed to upload video');
            }
            lastUploadedChunk++;
            res.send('Video uploaded successfully!');
        });
    });
});

// Serve the uploaded video
app.get('/video', (req, res) => {
    const filePath = path.join(__dirname, DIRECTORY, `example_${lastUploadedChunk - 1}.webm`);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('No such file');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
