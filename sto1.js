const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory (if needed)
app.use(express.static('public'));

// Parse JSON bodies (if needed)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sto1.html'));
  });


// Route to handle file upload
app.post('/upload', async (req, res) => {
    try {
        // Check if request contains the expected content type
      

        // Extract file data from request body
        let data = [];
        req.on('data', chunk => {
            console.log(chunk);
            data.push(chunk);
        });



        console.log(req.body);

        req.on('end', () => {
            // Combine all chunks into a single buffer
            const fileData = Buffer.concat(data);

            // Save video to a file
            const filePath = path.join(__dirname, 'uploads', 'videoss1.webm'); // Adjust path and filename as needed
            fs.writeFileSync(filePath, fileData);

            console.log('File saved successfully:', filePath);
            res.status(200).send('File uploaded successfully.');
        });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).send('Error saving file.');
    }
});

  
  // Start server
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
  