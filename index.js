const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors
const fs = require('fs'); // Import File System module
const path = require('path'); // Import Path module for handling file paths

const app = express();

// Use CORS middleware
app.use(cors());

// Set the public folder as static to serve files later
app.use(express.static('public'));

app.get('/download-image', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        const userId = req.query.userId; // Retrieve userId from query parameters
        const fileName = `${userId}-card.jpg`;
        const filePath = path.join(__dirname, 'public', fileName);

        // Check if the image already exists, and delete it if so
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Remove the existing image
        }

        // Download the new image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Save the new image to the public folder
        fs.writeFile(filePath, response.data, (err) => {
            if (err) {
                return res.status(500).send('Error saving the image');
            }

            // Send success message or image path
            res.json({ message: 'Image saved successfully', filePath: `/public/${fileName}` });
        });
    } catch (error) {
        res.status(500).send('Error downloading the image');
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
