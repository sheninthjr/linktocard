'use client';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import { ChartLine, Download, HandHeart, Link } from "lucide-react";
import { Response } from './HomePage';
import { useEffect, useState } from 'react';

export function Card({
    title,
    description,
    url,
    profile,
    userName,
    userId,
    imagePath
}: Response) {
    const [shareUrl, setShareUrl] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const handleCardDownload = async () => {
        const sanitizedTitle = title
        .replace(/\s+/g, '_')
        .replace(/[^\w\-]+/g, '');

        const publicId = `${userId}_${sanitizedTitle}`;
        const cardElement = document.getElementById('card');
        if (cardElement) {
            const canvas = await html2canvas(cardElement, {
                useCORS: true,
                backgroundColor: "#020617",
                scale: 6,
                allowTaint: true
            });

        const link = document.createElement('a');
        link.download = publicId;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
}
    const handleShareUpload = async() => {
        setIsLoading(true);
        const sanitizedTitle = title
        .replace(/\s+/g, '_')
        .replace(/[^\w\-]+/g, '');

        const publicId = `${userId}_${sanitizedTitle}`;
        const cardElement = document.getElementById('card');

        if (cardElement) {
            const canvas = await html2canvas(cardElement, {
                useCORS: true,
                backgroundColor: "#020617",
                scale: 6,
                allowTaint: true
            });

        const imageBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

        if (!imageBlob) {
            console.error("Failed to create image blob");
            return null;
        }
        const formData = new FormData();
        const api_key = process.env.NEXT_PUBLIC_API_KEY as string;
        const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET as string;
        formData.append('file', imageBlob);
        formData.append('upload_preset', upload_preset);
        formData.append('public_id', publicId);
        formData.append('api_key', api_key);
        try {
            const uploadResponse = await axios.post(
                'https://api.cloudinary.com/v1_1/linktopost/image/upload',
                formData
            );
            const uploadedImageUrl = uploadResponse.data.url;
            setShareUrl(uploadedImageUrl);
            setIsLoading(false)
            return uploadedImageUrl;
        } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            return null;
        }
        }
    }

    useEffect(() => {
        handleShareUpload();
    },[])

    return (
        <div className="flex items-center space-y-8 flex-col md:flex-row m-2">
            <div id="card" className="w-[360px] md:w-[380px] border p-4 rounded-2xl bg-slate-950 overflow-hidden">
                <div className="rounded-2xl">
                    <div className="flex items-end relative">
                        <img src={imagePath} alt="Thumbnail" className="w-full object-cover h-48 rounded-t-2xl" />
                        <div className="absolute z-8 flex-1 bg-white/80 backdrop-blur-md min-w-[346px] h-14 rounded-t-2xl"></div>
                        <img src="./yt.png" alt="icon" className="w-12 h-12 absolute z-5 mb-8 ml-5 rounded-xl bg-white" />
                        <div className="flex-1 absolute z-9 font-bold text-lg text-black justify-center pl-16 pb-3 truncate w-[310px] text-start">{title}</div>
                    </div>
                    <div className="p-4 bg-black rounded-b-2xl space-y-4">
                        <div className="flex gap-4 itemd:ml-8ms-center">
                            <img src={profile} alt="profile" className="w-14 h-14 object-cover rounded-full" />
                            <div className="flex flex-col justify-center">
                                <div className="font-bold text-xl text-white font-geistmono">{userName}</div>
                                <div className="text-neutral-400">@{userId}</div>
                            </div>
                        </div>
                        <div className="text-slate-200 line-clamp-5 pb-1 text-lg">
                            {description}
                        </div>
                        <div className="text-white flex justify-between items-center">
                            <div className="text-[#3FBDD0] font-bold text-xl flex items-center">
                                <a href={url} target="_blank" rel="noopener noreferrer" className="flex gap-1">
                                    <Link className="w-4 self-center h-4" />Link
                                </a>
                            </div>
                            <div className="flex space-x-4 items-center">
                                <div className="flex gap-1 font-semibold text-red-400 self-center">
                                    <HandHeart className="w-6 h-6 self-center" />Like
                                </div>
                                <div className='flex gap-1 self-center font-semibold text-blue-500'>
                                    <ChartLine className="w-4 h-4 font-semibold self-center" />Views
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex md:flex-col md:pl-14 justify-center space-x-8 md:space-x-8 items-center md:space-y-24'>
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white md:ml-8 rounded-lg ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <img src='./linkedin.png' alt='LinkedIn' className='w-12 h-12 rounded-lg hover:scale-150' />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this amazing post!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white rounded-lg ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <img src="./twitter.png" alt="Twitter" className='w-12 h-12 rounded-lg bg-white border hover:scale-150' />
                </a>
                <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white rounded-lg ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                >
                    <img src="./insta.webp" alt="Instagram" className='w-12 h-12 rounded-lg hover:scale-150' />
                </a>
                <button
                    className="bg-black/25 w-fit p-3 border border-slate-700 font-bold text-white rounded-lg"
                    onClick={handleCardDownload}
                >
                    <Download />
                </button>
            </div>
        </div>
        );

    }
