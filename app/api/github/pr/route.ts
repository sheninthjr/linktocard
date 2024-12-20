import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

const fetchGitHubData = async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        Referer: 'https://github.com/',
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

    const $ = cheerio.load(response.data);

    const title = $('title').text().trim();
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      '';

    const image =
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      '';

    const userName =
      $('meta[property="og:author:username"]').attr('content') || '';
    const avatar = $('a.TimelineItem-avatar img').attr('src') || '';

    const repoName =
      $('meta[name="octolytics-dimension-repository_nwo"]').attr('content') ||
      '';

    let prStatus = '';
    if ($('span[reviewable_state="ready"].State--open').length > 0) {
      prStatus = 'Open';
    } else if ($('span[reviewable_state="ready"].State--closed').length > 0) {
      prStatus = 'Closed';
    } else if ($('span[reviewable_state="ready"].State--merged').length > 0) {
      prStatus = 'Merged';
    }

    const createdAt = $('relative-time').attr('datetime') || '';
    const commentsCount = $('.timeline-comment-group').length;
    const labels = $('.labels .IssueLabel')
      .map((_, el) => $(el).text().trim())
      .get();

    let imagePath = null;
    if (image) {
      try {
        imagePath = await downloadImage(image, `${repoName}-pr-image.jpg`);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }

    return {
      title,
      description,
      image,
      userName,
      prStatus,
      avatar,
      repoName,
      createdAt,
      commentsCount,
      labels,
      imagePath,
    };
  } catch (error) {
    console.error('Error in fetchGitHubData:', error);
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

    const githubData = await fetchGitHubData(url);
    const response = NextResponse.json(githubData);

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
