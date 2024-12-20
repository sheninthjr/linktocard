import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

const axiosConfig = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    Referer: 'https://www.youtube.com/',
    DNT: '1',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
  },
};

const downloadImage = async (url: string, fileName: string) => {
  if (!url) return null;

  try {
    const response = await axios.get(url, {
      ...axiosConfig,
      responseType: 'arraybuffer',
    });
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
  if (!userId) return null;

  try {
    const profileUrl = `https://www.youtube.com/@${userId}`;
    const { data } = await axios.get(profileUrl, axiosConfig);
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
    const { data } = await axios.get(formattedUrl, axiosConfig);

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
    console.error('Error fetching YouTube data:', error);
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
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  } catch (error) {
    console.error('Error processing request:', error);
    const response = NextResponse.json(
      {
        message: 'Error while extracting',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
