import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body.url;
    if (!url) {
      return NextResponse.json({ message: 'Url Required' }, { status: 400 });
    }
    const { data } = await axios.get(`http://localhost:8080/${url}`, {
      headers: {
        Origin: 'http://localhost',
      },
    });

    const $ = cheerio.load(data);
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content');
    const image =
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image"]').attr('content');
    const userName = $('meta[property="og:author:username"]').attr('content');
    let prStatus = '';
    if ($('span[reviewable_state="ready"].State--open').length > 0) {
      prStatus = 'Open';
    } else if ($('span[reviewable_state="ready"].State--closed').length > 0) {
      prStatus = 'Closed';
    } else if ($('span[reviewable_state="ready"].State--merged').length > 0) {
      prStatus = 'Merged';
    }
    const avatar = $('a.TimelineItem-avatar img').attr('src');

    return NextResponse.json({
      title,
      description,
      image,
      userName,
      prStatus,
      avatar,
    });
  } catch (e: any) {
    console.log(e);
    NextResponse.json({ message: 'Error while extracting' });
  }
}
