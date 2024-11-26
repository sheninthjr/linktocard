'use server';

import prisma from '@/db';

export async function SavingToDB(uploadedImageUrl: string, userId: string) {
  if (!userId) {
    return;
  }
  try {
    const response = await prisma.post.create({
      data: {
        postUrl: uploadedImageUrl,
        type: 'YOUTUBE',
        createdAt: new Date(),
        userId: userId,
      },
    });
    console.log('Post created successfully:', response);
  } catch (error) {
    console.error('Error creating post in Prisma:', error);
  }
}
