'use client'
import html2canvas from 'html2canvas-pro';
import { ChartLine, HandHeart, Link } from "lucide-react";
import { LinkedinShareButton } from "react-share";

export function Card() {

    const handleCardDownload = async () => {
        const cardElement = document.getElementById('card');
        if (cardElement) {
            const canvas = await html2canvas(cardElement, {
                useCORS: true,
                backgroundColor: "#020617",
                scale: 6,
                allowTaint: true
            });
            const link = document.createElement('a');
            link.download = 'card-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const shareURL = "https://ideogram.ai/assets/progressive-image/balanced/response/7XhjeL97T0SWyh1-miM3qg";
    const description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro quisquam molestiae, atque explicabo tenetur tempore ex consequatur ducimus."
const title = "How to integrate prisma "
    return (
        <div className="flex items-center space-y-8 flex-col">
            <div id="card" className="w-[380px] border p-4 rounded-2xl bg-slate-950 overflow-hidden">
                <div className="rounded-2xl">
                    <div className="flex items-end relative">
                        <img src={"./ideo.jpeg"} alt="Thumbnail" className="w-full rounded-t-2xl" />
                        <div className="absolute z-8 flex-1 bg-white/20 backdrop-blur-md min-w-[346px] h-16 rounded-t-2xl"></div>
                        <img src="./yt.png" alt="icon" className="w-12 h-12 absolute z-5 mb-10 ml-5 rounded-xl bg-white" />
                        <div className="flex-1 absolute z-9 font-bold text-lg text-white justify-center pl-16 pb-4 truncate w-[320px] text-start">How to integrate prisma safasfsadsfs Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit dolores libero aspernatur qui, corrupti voluptates commodi! Error est facilis voluptatum. Vero doloremque nisi saepe voluptates maiores cum et impedit ipsum.</div>
                    </div>
                    <div className="p-4 bg-black rounded-b-2xl space-y-4">
                        <div className="flex gap-4 items-center">
                            <img src="./avatar.png" alt="profile" className="w-14 h-14 object-cover rounded-full" />
                            <div className="flex flex-col justify-center">
                                <div className="font-bold text-xl text-white font-geistmono">Sheninth Jr</div>
                                <div className="text-neutral-400">@sheninthjr</div>
                            </div>
                        </div>
                        <div className="text-slate-200 line-clamp-5 pb-1 text-lg">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro quisquam molestiae, atque explicabo tenetur tempore ex consequatur ducimus, enim ipsum deserunt. Impedit minima voluptates delectus beatae pariatur nisi veniam rem?
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus adipisci porro nisi incidunt placeat odit perferendis, modi omnis exercitationem dolorum reiciendis fugit eveniet quas vel accusantium! Deleniti, corporis. Reprehenderit, id.
                        </div>
                        <div className="text-white flex justify-between items-center">
                            <div className="text-[#3FBDD0] font-bold text-xl flex items-center">
                                <a href="https://x.com/sheninthjr" target="_blank" rel="noopener noreferrer" className="flex gap-1"><Link className="w-4 self-center h-4" />Link</a>
                            </div>
                            <div className="flex space-x-4 items-center">
                                <div className="flex gap-1 font-semibold text-red-400 self-center"><HandHeart className="w-6 h-6 self-center" />Like</div>
                                <div className='flex gap-1 self-center font-semibold text-blue-500'><ChartLine className="w-4 h-4 font-semibold self-center" />Views</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className="bg-blue-600 p-4 text-white rounded-lg flex flex-col justify-between" onClick={handleCardDownload}>Download</button>
            <div className="flex space-x-4">
                <LinkedinShareButton title={title} url={shareURL} summary={description}>LinkedIn</LinkedinShareButton>

                <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareURL)}&text=Check out this amazing post!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1DA1F2] p-4 text-white rounded-lg"
                >
                    Share on Twitter
                </a>

                <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#E1306C] p-4 text-white rounded-lg"
                >
                    Share on Instagram
                </a>
            </div>
        </div>
    );
}
