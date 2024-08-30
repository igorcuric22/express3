const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploadsxx')) {
    fs.mkdirSync('uploadsxx');
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON bodies (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sto4.html'));
});

// Route to handle file upload
// app.put('/api/upload', (req, res) => {
//     const STREAM_NAME = req.headers['x-stream-name'] || `${Date.now()}.webm`;
//     const CHUNK_NUMBER = req.headers['x-chunk-number'] || 0;
//     const filePath = path.join(__dirname, 'uploads', `${STREAM_NAME}_chunk_${CHUNK_NUMBER}.webm`);

//     const writeStream = fs.createWriteStream(filePath);

//     req.pipe(writeStream);

//     writeStream.on('finish', () => {
//         console.log(`Chunk ${CHUNK_NUMBER} uploaded successfully.`);
//         res.status(200).send('Chunk uploaded successfully.');
//     });

//     writeStream.on('error', (err) => {
//         console.error('Error uploading chunk:', err);
//         res.status(500).send('Error uploading chunk.');
//     });
// });

// app.put('/api/upload', (req, res) => {
//     const STREAM_NAME = req.headers['x-stream-name'] || `${Date.now()}.webm`;
//     const CHUNK_NUMBER = parseInt(req.headers['x-chunk-number']) || 0; // Ensure chunk number is parsed as an integer

//     const filePath = path.join(__dirname, 'uploads', `${STREAM_NAME}_chunk_${CHUNK_NUMBER}.webm`);

//     const writeStream = fs.createWriteStream(filePath);

//     req.pipe(writeStream);

//     writeStream.on('finish', () => {
//         console.log(`Chunk ${CHUNK_NUMBER} of ${STREAM_NAME} uploaded successfully.`);
//         res.status(200).send('Chunk uploaded successfully.');
//     });

//     writeStream.on('error', (err) => {
//         console.error('Error uploading chunk:', err);
//         res.status(500).send('Error uploading chunk.');
//     });
// });


app.put('/api/upload', (req, res) => {
    const STREAM_NAME = req.headers['x-stream-name'] || `${Date.now()}.webm`;
    const CHUNK_NUMBER = parseInt(req.headers['x-chunk-number']) || 0;

    const filePath = path.join(__dirname, 'uploadsxx', `${STREAM_NAME}_chunk_${CHUNK_NUMBER}.webm`);

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
