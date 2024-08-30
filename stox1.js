const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Directory to store uploaded files
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Function to handle file uploads
function handleUpload(req, res) {
    const { name, chunk } = url.parse(req.url, true).query;
    const filename = `${name}_chunk_${chunk}`;
    const filepath = path.join(uploadDir, filename);

    const fileStream = fs.createWriteStream(filepath);
    req.pipe(fileStream);

    req.on('end', () => {
        res.statusCode = 200;
        res.end('Chunk uploaded');
    });

    req.on('error', (err) => {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    });
}

// Function to handle file downloads
function handleDownload(req, res, query) {
    const { name, chunk } = query;
    const filename = `${name}_chunk_${chunk}`;
    const filepath = path.join(uploadDir, filename);

    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            res.statusCode = 404;
            res.end('Chunk not found');
            return;
        }

        const fileStream = fs.createReadStream(filepath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'video/webm');
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
    });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (req.method === 'PUT' && pathname === '/api/upload') {
        handleUpload(req, res);
    } else if (req.method === 'GET' && pathname === '/api/download') {
        handleDownload(req, res, parsedUrl.query);
    } else if (req.method === 'GET' && pathname === '/') {
        serveIndexHtml(res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

// Function to serve the index.html file
function serveIndexHtml(res) {
    const filePath = path.join(__dirname,'public','stox1.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    });
}

// Start the server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
