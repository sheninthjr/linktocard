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
    const { data } = await axios.get(url, {
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

    const $ = cheerio.load(data);
    const jsonLdScript = $('script[type="application/ld+json"]').html();
    const jsonData = JSON.parse(jsonLdScript!);
    const authorName = jsonData.author?.name;
    const authorBio = $('p.comment__author-headline').text().trim();
    const followers = $('p.public-post-author-card__followers').text().trim();
    const authorImageUrl = jsonData.author?.image?.url || '';
    const description = jsonData.articleBody;
    const imageUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="image"]').attr('content') ||
      '';

    return NextResponse.json({
      authorName,
      authorBio,
      followers,
      description,
      authorImageUrl,
      imageUrl,
    });
  } catch (e) {
    console.log(e);
    NextResponse.json({ message: 'Error while extracting' });
  }
}
