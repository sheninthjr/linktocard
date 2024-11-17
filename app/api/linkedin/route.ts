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
