import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

const userImage = async (url: string) => {
  const { data } = await axios.get(`http://localhost:8080/${url}`, {
    headers: {
      Origin: 'http://localhost',
    },
  });
  const $ = cheerio.load(data);
  const image =
    $('meta[name="twitter:image"]').attr('content') ||
    $('meta[property="og:image"]').attr('content');
  return image;
};

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
    const title = $(
      'meta[name="octolytics-dimension-repository_network_root_nwo"]',
    ).attr('content');
    const trimmedTitle = title?.split('/')[1];
    const description = $('meta[name="description"]').attr('content');
    const image = $('meta[name="twitter:image"]').attr('content');
    const userName = title?.split('/')[0];
    const avatar = await userImage(url.split('/').slice(0, 4).join('/'));
    const repoName = $('meta[name="octolytics-dimension-repository_nwo"]').attr(
      'content',
    );
    const prStatus = $('span.fgColor-default').text().trim();

    return NextResponse.json({
      title: trimmedTitle,
      description,
      image,
      userName,
      prStatus,
      avatar,
      repoName,
    });
  } catch (e) {
    console.error(e);
    NextResponse.json({ message: 'Error while extracting' });
  }
}
