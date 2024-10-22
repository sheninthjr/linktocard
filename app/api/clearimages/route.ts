import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST() {
    const publicDir = path.join(process.cwd(),'public/uploads');
    fs.readdir(publicDir,(err,files) => {
        if(err) {
            console.error("Error while deleting",err);
            return NextResponse.json({ message: 'Error reading public folder' },{status: 500});
        }
        files.forEach(file => {
            if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
              fs.unlink(path.join(publicDir, file), err => {
                if (err) {
                  console.error(`Error deleting file ${file}:`, err);
                }
              });
            }
          });
          NextResponse.json({ message: 'Images deleted' },{status:200})
    })
}
