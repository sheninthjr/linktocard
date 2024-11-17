import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

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
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('._aagw img');
    const $ = cheerio.load(data);
    const title = $('meta[name="twitter:title"]').attr('content');
    const description = $('meta[name="description"').attr('content');

    return NextResponse.json({
      title,
      description,
    });
  } catch (e) {
    console.log(e);
  }
}
