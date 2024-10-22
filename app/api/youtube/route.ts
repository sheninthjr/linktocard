import { NEXT_PUBLIC_API_KEY, NEXT_PUBLIC_UPLOAD_PRESET } from "@/config";
import axios from "axios";
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from "next/server";
const downloadImage = async (url: string, fileName: string) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageBuffer = response.data;
        const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('file', imageBlob, fileName);
        formData.append('upload_preset', NEXT_PUBLIC_UPLOAD_PRESET);
        formData.append('public_id', fileName);
        formData.append('api_key', NEXT_PUBLIC_API_KEY);
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
        const { data } = await axios.get(profileUrl);
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
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const title = $('meta[name="title"]').attr('content');
        const description = $('meta[name="description"]').attr('content');
        const imageSrc = $('link[rel="image_src"]').attr('href') || "";
        const userName = $('span[itemprop="author"] link[itemprop="name"]').attr('content');
        const id = $('span[itemprop="author"] link[itemprop="url"]').attr('href') || "";
        const userId = id?.split('http://www.youtube.com/@')[1];
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
