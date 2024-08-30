// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 3000;

// // Middleware to parse form-data requests
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'si1.html'));
// });


// app.post('/upload', (req, res) => {
//     let data = '';
//     req.on('data', chunk => {
//         data += chunk;
//     });
//     req.on('end', () => {
//         const formData = new URLSearchParams(data);
//         const fileName = formData.get('fileName');
//         const fileSize = parseInt(formData.get('fileSize'), 10);
//         const offset = parseInt(formData.get('offset'), 10);
//         const chunk = formData.get('chunk');

//         const filePath = path.join(__dirname, 'uploads', fileName);
        
//         const buffer = Buffer.from(chunk.split(',')[1], 'base64');

//         fs.open(filePath, 'a', (err, fd) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Failed to open file' });
//             }
//             fs.write(fd, buffer, 0, buffer.length, offset, (err) => {
//                 if (err) {
//                     return res.status(500).json({ error: 'Failed to write chunk' });
//                 }
//                 fs.close(fd, (err) => {
//                     if (err) {
//                         return res.status(500).json({ error: 'Failed to close file' });
//                     }
//                     const isDone = offset + buffer.length >= fileSize;
//                     res.json({ done: isDone });
//                 });
//             });
//         });
//     });
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'si1.html'));
});


app.post('/upload', (req, res) => {
    let data = Buffer.alloc(0);

    req.on('data', chunk => {
        data = Buffer.concat([data, chunk]);
    });

    req.on('end', () => {
        const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
        const parts = data.toString().split(`--${boundary}`);

        const fileName = parts[1].match(/name="fileName"\r\n\r\n(.+)\r\n/)[1];
        const fileSize = parseInt(parts[1].match(/name="fileSize"\r\n\r\n(.+)\r\n/)[1], 10);
        const offset = parseInt(parts[1].match(/name="offset"\r\n\r\n(.+)\r\n/)[1], 10);
        const chunk = parts[2].match(/\r\n\r\n([\s\S]*)\r\n--/)[1];

        const buffer = Buffer.from(chunk, 'binary');
        const filePath = path.join(__dirname, 'uploads', fileName);

        fs.open(filePath, 'a', (err, fd) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to open file' });
            }
            fs.write(fd, buffer, 0, buffer.length, offset, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to write chunk' });
                }
                fs.close(fd, (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to close file' });
                    }
                    const isDone = offset + buffer.length >= fileSize;
                    res.json({ done: isDone });
                });
            });
        });
    });

    req.on('error', err => {
        res.status(500).json({ error: 'Failed to process request' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
