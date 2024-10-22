'use client'
import { useEffect, useState } from "react";
import { Card } from "./Card";
import axios from "axios";
import { Loader } from "./Loader";

export interface Response {
    title: string;
    description:string;
    profile:string;
    url:string;
    imagePath:string;
    userName:string;
    userId:string;
}
export function HomePage() {
    const [url,setUrl] = useState('');
    const [buttonClicked,setButtonClicked] = useState(false)
    const [isLoading,setIsLoading] = useState(false);
    const [metadata,setMetaData] = useState({
        title:"",
        description:"",
        url:"",
        profile:"",
        userName:"",
        userId:"",
        imagePath:""
    })

    useEffect(()=>{
        const deleteImages = async() => {
            try {
                axios.post('/api/clearimages')
            } catch (error) {
                console.error(error)
            }
        }
        deleteImages()
    },[])

    const handleButtonClick = async() =>{
        setIsLoading(true)
        const response = await axios.post('api/youtube', { url });
        setMetaData({
            title: response.data.title,
            description: response.data.description,
            profile: response.data.profile,
            url:url,
            userName: response.data.userName,
            userId: response.data.userId,
            imagePath: response.data.imagePath
        });
        setIsLoading(false);
        setButtonClicked(true)
    }
    return (
        <div className="xl:w-[80%] md:pr-10 lg:pl-10  md:pl-16 lg:pr-10 flex mx-auto flex-col w-full lg:flex-row justify-center items-center rounded-2xl shadow-lg overflow-hidden space-y-10 md:space-y-0 pb-10 md:pb-0">
            <div className="lg:w-1/2 w-full pt-24 flex md:p-8 flex-col justify-center space-y-16 h-fit items-center rounded-l-xl">
                <h1 className="text-white text-5xl font-extrabold font-serif"><span className="text-7xl">L</span>inkTo<span className="text-7xl">P</span>ost</h1>
                <h1 className="text-white text-4xl font-extrabold text-center font-serif leading-tight mb-6 p-4">
                    Instantly Turn Your Link into a Stunning Visual Post. Just Paste & Click!
                </h1>
                <input
                    type="text"
                    className="p-3 bg-black/20 border border-slate-700 text-white text-lg outline-none w-[80%] rounded-lg mb-4"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="Paste your URL here"
                />
                <button className="text-white font-semibold py-3 px-6 rounded-full transition duration-300 bg-black/60 border border-slate-700" onClick={handleButtonClick}>
                    Generate
                </button>
            </div>
            <div className="flex justify-center items-center self-center rounded-r-2xl h-screen md:pl-20 lg:pl-0 xl:pl-0 w-full md:w-1/2 p-8">
                {isLoading ? <Loader/> : buttonClicked && (<Card title={metadata.title} description={metadata.description}  url={metadata.url} profile={metadata.profile} userName={metadata.userName} userId={metadata.userId} imagePath={metadata.imagePath}/>)}
            </div>
        </div>
    );
}
