import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

const getVideoId = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

const fetchYouTubeData = async (url: string) => {
  try {
    const videoId = getVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const oembedResponse = await axios.get(
      `https://www.youtube.com/oembed?url=${watchUrl}&format=json`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
          Referer: 'https://www.youtube.com/',
        },
      },
    );
    const watchResponse = await axios.get(watchUrl, {
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
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
    });

    const watchPage$ = cheerio.load(watchResponse.data);

    let views = '0';
    try {
      const jsonLd = watchPage$('script[type="application/ld+json"]').html();
      if (jsonLd) {
        const jsonData = JSON.parse(jsonLd);
        if (jsonData?.interactionStatistic?.userInteractionCount) {
          views = jsonData.interactionStatistic.userInteractionCount;
        }
      }
      if (views === '0') {
        const scripts = watchPage$('script').get();
        for (const script of scripts) {
          const content = watchPage$(script).html() || '';
          if (content.includes('ytInitialData')) {
            const match = content.match(
              /"viewCount":\s*{\s*"simpleText":\s*"([\d,]+)"/,
            );
            if (match && match[1]) {
              views = match[1].replace(/,/g, '');
              break;
            }
          }
        }
      }
      if (views === '0') {
        const patterns = [
          /"viewCount":"(\d+)"/,
          /\"viewCount\":\"(\d+)\"/,
          /"viewCount":(\d+)/,
          /"videoViewCountRenderer":\{"viewCount":\{"simpleText":"([\d,]+)/,
        ];

        for (const pattern of patterns) {
          const match = watchResponse.data.match(pattern);
          if (match && match[1]) {
            views = match[1].replace(/,/g, '');
            break;
          }
        }
      }
      if (views === '0') {
        const metaViews = watchPage$('meta[itemprop="interactionCount"]').attr(
          'content',
        );
        if (metaViews) {
          views = metaViews;
        }
      }
    } catch (error) {
      console.error('Error extracting views:', error);
    }
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const description = $('meta[name="description"]').attr('content') || '';

    const title = oembedResponse.data.title || '';
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const authorName = oembedResponse.data.author_name || '';
    const authorUrl = oembedResponse.data.author_url || '';
    const userId = authorUrl.split('@')[1] || '';
    let profile = null;
    try {
      if (authorUrl) {
        const authorResponse = await axios.get(authorUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Referer: 'https://www.youtube.com/',
          },
        });
        const author$ = cheerio.load(authorResponse.data);
        profile = author$('link[rel="image_src"]').attr('href');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    let imagePath = null;
    if (thumbnailUrl) {
      try {
        imagePath = await downloadImage(
          thumbnailUrl,
          `${videoId}-thumbnail.jpg`,
        );
      } catch (error) {
        console.error('Error downloading thumbnail:', error);
      }
    }

    return {
      title,
      description,
      imageSrc: thumbnailUrl,
      profile,
      userName: authorName,
      userId,
      imagePath,
      views,
    };
  } catch (error) {
    console.error('Error in fetchYouTubeData:', error);
    throw error;
  }
};

const downloadImage = async (url: string, fileName: string) => {
  if (!url) return null;

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
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
    return uploadResponse.data.secure_url;
  } catch (error) {
    console.error('Error downloading or uploading image:', error);
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ message: 'URL Required' }, { status: 400 });
    }

    const videoData = await fetchYouTubeData(url);
    const response = NextResponse.json(videoData);

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      {
        message: 'Error while extracting',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
