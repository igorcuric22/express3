// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 3000;
// const UPLOAD_DIR = 'uploadsd1';

// // Create 'uploads' directory if it doesn't exist
// if (!fs.existsSync(UPLOAD_DIR)) {
//     fs.mkdirSync(UPLOAD_DIR);
// }

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // Serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'dva1.html')); // Corrected file name
// });

// // Handle video chunk uploads
// app.put('/api/upload', (req, res) => {
//     const streamName = req.headers['x-stream-name'] || `${Date.now()}.webm`;
//     const chunkNumber = parseInt(req.headers['x-chunk-number']) || 0;
//     const filePath = path.join(__dirname, UPLOAD_DIR, `${streamName}_chunk_${chunkNumber}.webm`);

//     const writeStream = fs.createWriteStream(filePath);

//     req.pipe(writeStream);

//     writeStream.on('finish', () => {
//         console.log(`Chunk ${chunkNumber} of ${streamName} uploaded successfully.`);
//         res.status(200).send('Chunk uploaded successfully.');
//     });

//     writeStream.on('error', (err) => {
//         console.error(`Error writing chunk ${chunkNumber} of ${streamName}:`, err);
//         res.status(500).send('Error writing chunk.');
//     });

//     req.on('error', (err) => {
//         console.error(`Request error for chunk ${chunkNumber} of ${streamName}:`, err);
//         res.status(500).send('Request error.');
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 3000;
// const UPLOAD_DIR = 'uploadsd2';

// // Create 'uploads' directory if it doesn't exist
// if (!fs.existsSync(UPLOAD_DIR)) {
//     fs.mkdirSync(UPLOAD_DIR);
// }

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // Serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'dva1.html')); // Corrected file name
// });

// // Middleware to parse incoming request bodies
// app.use(express.raw({ limit: '10mb', type: 'video/webm' }));

// // Handle video chunk uploads
// app.put('/api/upload', (req, res) => {
//     const streamName = req.headers['x-stream-name'] || `${Date.now()}.webm`;
//     const chunkNumber = parseInt(req.headers['x-chunk-number']) || 0;
//     const filePath = path.join(__dirname, UPLOAD_DIR, `${streamName}_chunk_${chunkNumber}.webm`);

//     console.log(`Received chunk ${chunkNumber} for stream ${streamName}`);

//     if (req.body.length > 0) {
//         console.log(`Chunk ${chunkNumber} size: ${req.body.length} bytes`);

//         fs.writeFile(filePath, req.body, (err) => {
//             if (err) {
//                 console.error(`Error writing chunk ${chunkNumber} of ${streamName}:`, err);
//                 return res.status(500).send('Error writing chunk.');
//             }

//             console.log(`Chunk ${chunkNumber} of ${streamName} uploaded successfully.`);
//             res.status(200).send('Chunk uploaded successfully.');
//         });
//     } else {
//         console.error(`Chunk ${chunkNumber} of ${streamName} is empty.`);
//         res.status(400).send('Chunk is empty.');
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// const express = require('express');
// const fs = require('fs').promises; // Using promises version of fs
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 3000;
// const UPLOAD_DIR = 'uploadsd2';

// // Create 'uploads' directory asynchronously if it doesn't exist
// fs.mkdir(path.join(__dirname, UPLOAD_DIR), { recursive: true })
//     .catch(err => {
//         console.error('Error creating upload directory:', err);
//     });

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // Serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'dva1.html'));
// });

// // Middleware to parse incoming request bodies
// app.use(express.raw({ limit: '10mb', type: 'video/webm' }));

// // Handle video chunk uploads
// app.put('/api/upload', async (req, res) => {
//     const streamName = req.headers['x-stream-name'] || `${Date.now()}.webm`;
//     const chunkNumber = parseInt(req.headers['x-chunk-number']) || 0;
//     const filePath = path.join(__dirname, UPLOAD_DIR, `${streamName}_chunk_${chunkNumber}.webm`);

//     console.log(`Received chunk ${chunkNumber} for stream ${streamName}`);

//     try {
//         if (req.body.length > 0) {
//             console.log(`Chunk ${chunkNumber} size: ${req.body.length} bytes`);

//             // Write chunk to file using promises
//             await fs.writeFile(filePath, req.body);

//             console.log(`Chunk ${chunkNumber} of ${streamName} uploaded successfully.`);
//             res.status(200).send('Chunk uploaded successfully.');
//         } else {
//             console.error(`Chunk ${chunkNumber} of ${streamName} is empty.`);
//             res.status(400).send('Chunk is empty.');
//         }
//     } catch (err) {
//         console.error(`Error writing chunk ${chunkNumber} of ${streamName}:`, err);
//         res.status(500).send('Error writing chunk.');
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

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
    res.sendFile(path.join(__dirname, 'public', 'dva1.html'));
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

