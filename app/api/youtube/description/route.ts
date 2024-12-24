import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const description = $('meta[name="description"]').attr('content') || '';
    return NextResponse.json({
      description,
    });
  } catch (e) {
    return NextResponse.json({
      message: 'Failed to fetch the description',
    });
  }
}
