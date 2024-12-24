import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 },
      );
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.items?.[0]?.snippet?.description) {
      return NextResponse.json(
        { error: 'Description not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      description: data.items[0].snippet.description,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Failed to fetch description' },
      { status: 500 },
    );
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}
