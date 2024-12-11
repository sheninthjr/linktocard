import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

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
      formData,
    );
    const uploadedImageUrl = uploadResponse.data.secure_url;
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
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const { data } = await axios.get(`${formattedUrl}`);

    const $ = cheerio.load(data);
    const title = $('meta[name="title"]').attr('content');
    const description = $('meta[name="description"]').attr('content');
    const imageSrc = $('link[rel="image_src"]').attr('href') || '';
    const userName = $('span[itemprop="author"] link[itemprop="name"]').attr(
      'content',
    );
    const id =
      $('span[itemprop="author"] link[itemprop="url"]').attr('href') || '';
    const userId = id?.split('http://www.youtube.com/@')[1];
    const imagePath = await downloadImage(
      imageSrc,
      `${userId + title}-thumbnail.jpg`,
    );
    const profile = await fetchYTProfile(userId);

    const viewsRegex = /(\d[\d,.]*) views/;
    const viewsMatch = data.match(viewsRegex);
    let views = null;
    if (viewsMatch && viewsMatch[1]) {
      views = viewsMatch[1].replace(/,/g, '');
    }
    return {
      title,
      description,
      imageSrc,
      profile,
      userName,
      userId,
      imagePath,
      views,
    };
  } catch (error) {
    console.log(error);
    throw new Error('Could not fetch data');
  }
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = body.url;
  if (!url) {
    return NextResponse.json({ message: 'Url Required' }, { status: 400 });
  }

  try {
    const videoData = await fetchYouTubeData(url);
    const response = NextResponse.json(videoData);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.log(error);
    const response = NextResponse.json({
      message: 'Error while extracting',
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  }
}
