import axios from "axios";
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from "next/server";
const downloadImage = async (url: string, fileName: string) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageBuffer = response.data;
        const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
        const api_key = process.env.NEXT_PUBLIC_API_KEY as string;
        const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET as string;
        const formData = new FormData();
        formData.append('file', imageBlob, fileName);
        formData.append('upload_preset', upload_preset);
        formData.append('public_id', fileName);
        formData.append('api_key', api_key);
        const uploadResponse = await axios.post(
            'https://api.cloudinary.com/v1_1/linktopost/image/upload',
            formData
        );
        const uploadedImageUrl = uploadResponse.data.url;
        return uploadedImageUrl;
    } catch (error) {
        console.error('Error downloading or uploading image:', error);
        return null;
    }
};


const fetchYTProfile = async (userId: string) => {
    try {
        const profileUrl = `http://www.youtube.com/@${userId}`;
        const { data } = await axios.get(profileUrl,{headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9,ta;q=0.8',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
            'Referer': 'http://localhost:3000/home',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"'
          },});
        const $ = cheerio.load(data);
        const imageSrc = $('link[rel="image_src"]').attr('href');
        return imageSrc;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

const fetchYouTubeData = async (url: string) => {
    try {
        const { data } = await axios.get(url,{headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9,ta;q=0.8',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000',
            'Referer': 'http://localhost:3000/home',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Linux"'
          },});
        const $ = cheerio.load(data);
        const title = $('meta[name="title"]').attr('content');
        const description = $('meta[name="description"]').attr('content');
        const imageSrc = $('link[rel="image_src"]').attr('href') || "";
        const userName = $('span[itemprop="author"] link[itemprop="name"]').attr('content');
        const id = $('span[itemprop="author"] link[itemprop="url"]').attr('href') || "";
        const userId = id?.split('http://www.youtube.com/@')[1];
        console.log(title,description,imageSrc,userName)
        const imagePath = await downloadImage(imageSrc, `${userId}-thumbnail.jpg`);
        const profile = await fetchYTProfile(userId);

        return {
            title,
            description,
            imageSrc,
            profile,
            userName,
            userId,
            imagePath
        };
    } catch (error) {
        console.log(error);
        throw new Error('Could not fetch data');
    }
};

export async function POST(req:NextRequest) {
    const body = await req.json();
    const url = body.url;
    if (!url) {
        return NextResponse.json({message: "Url Required"},{status:400});
    }

    try {
        const videoData = await fetchYouTubeData(url);
        return NextResponse.json(videoData);
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message:"Error while extracting"
        })
    }
}
