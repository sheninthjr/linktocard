// index.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Function to fetch YouTube user profile image
const fetchYTProfile = async (userId) => {
    try {
        // Construct the user profile URL
        const profileUrl = `http://www.youtube.com/@${userId}`;
        const { data } = await axios.get(profileUrl);
        const $ = cheerio.load(data);
        const imageSrc = $('link[rel="image_src"]').attr('href'); // Extract user profile image
        return imageSrc;
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        return null; // Return null or a default image if there's an error
    }
};

// Function to fetch YouTube video data
const fetchYouTubeData = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract title, description, image source
        const title = $('meta[name="title"]').attr('content');
        const description = $('meta[name="description"]').attr('content');
        const imageSrc = $('link[rel="image_src"]').attr('href');
        const userName = $('span[itemprop="author"] link[itemprop="name"]').attr('content');
        const id = $('span[itemprop="author"] link[itemprop="url"]').attr('href');
        const userId = id.split('http://www.youtube.com/@')[1]; // Extract the part after '@'

        // Fetch user profile image
        const profile = await fetchYTProfile(userId);

        return {
            title,
            description,
            imageSrc,
            profile,
            userName, // Include user name in the response
            userId, // Include user ID in the response
        };
    } catch (error) {
        throw new Error('Could not fetch data');
    }
};

// API endpoint to get video data
app.post('/extract', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'YouTube URL is required' });
    }

    try {
        const videoData = await fetchYouTubeData(url);
        return res.json(videoData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
