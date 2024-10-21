const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // To fetch external image
const app = express();

app.use(cors());
const PORT = 5000;

app.use(express.json({ limit: '10mb' })); // To parse JSON bodies

// Endpoint to download and save external image
app.post('/download-image', async (req, res) => {
    try {
        const imageUrl = "https://images8.alphacoders.com/473/thumb-1920-473471.jpg"; // External image URL
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer' // Handle image data as binary buffer
        });

        const filePath = path.join(__dirname, 'public', 'uploads', 'downloaded-image.jpg');

        // Write image data to the public folder
        fs.writeFile(filePath, response.data, 'binary', (err) => {
            if (err) {
                console.error('Error saving image:', err);
                return res.status(500).send('Error saving image');
            }
            res.status(200).send({
                message: 'Image downloaded and saved successfully',
                imagePath: '/uploads/downloaded-image.jpg'
            });
        });
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).send('Error downloading image');
    }
});

// Serve static files from the public folder
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
