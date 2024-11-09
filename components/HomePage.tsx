'use client';
import { useState } from 'react';
import { YoutubeCard } from './YoutubeCard';
import axios from 'axios';
import { Loader } from './Loader';
import { LinkedInResponse } from '@/types';
import { LinkedInCard } from './LinkedInCard';

export function HomePage({ title }: { title: string }) {
  const [url, setUrl] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetaData] = useState({
    title: '',
    description: '',
    url: '',
    profile: '',
    userName: '',
    userId: '',
    imagePath: '',
    views: '',
  });
  const [linkedInMetadata, setLinkedInMetadata] = useState<LinkedInResponse>({
    authorName: '',
    authorBio: '',
    followers: '',
    description: '',
    authorImageUrl: '',
    imageUrl: '',
  });

  const handleButtonClick = async () => {
    setIsLoading(true);
    if (title === 'youtube') {
      const response = await axios.post('api/youtube', { url });
      setMetaData({
        title: response.data.title,
        description: response.data.description,
        profile: response.data.profile,
        url: url,
        userName: response.data.userName,
        userId: response.data.userId,
        imagePath: response.data.imagePath,
        views: response.data.views,
      });
    } else if (title === 'linkedin') {
      const response = await axios.post('api/linkedin', { url });
      setLinkedInMetadata({
        authorName: response.data.authorName,
        authorBio: response.data.authorBio,
        followers: response.data.followers,
        description: response.data.description,
        authorImageUrl: response.data.authorImageUrl,
        imageUrl: response.data.imageUrl,
      });
    }
    setIsLoading(false);
    setButtonClicked(true);
  };
  return (
    <div className="xl:w-[80%] md:pr-10 lg:pl-10  md:pl-16 lg:pr-10 flex mx-auto flex-col w-full lg:flex-row justify-center items-center rounded-2xl shadow-lg overflow-hidden space-y-10 md:space-y-0 pb-10 md:pb-0">
      <div className="lg:w-1/2 w-full pt-24 flex md:p-8 flex-col justify-center space-y-16 h-fit items-center rounded-l-xl">
        <h1 className="text-white text-5xl font-extrabold text-start font-montserrat leading-tight mb-6 p-4">
          Instantly Turn Your Link into a Stunning Visual Post. Just Paste &
          Click!
        </h1>
        <input
          type="text"
          className="p-4 bg-gray-800 border border-slate-600 text-white text-lg outline-none w-[80%] rounded-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste your URL here"
        />
        <button
          className="text-white font-semibold py-3 px-6 rounded-full transition duration-300 bg-black/60 border border-slate-700"
          onClick={handleButtonClick}
        >
          Generate
        </button>
      </div>
      <div className="flex justify-center items-center self-center rounded-r-2xl h-screen md:pl-20 lg:pl-0 xl:pl-0 w-full md:w-1/2 p-8">
        {isLoading ? (
          <Loader />
        ) : (
          buttonClicked && (
            <>
              {title === 'youtube' && (
                <YoutubeCard
                  title={metadata.title}
                  description={metadata.description}
                  url={metadata.url}
                  profile={metadata.profile}
                  userName={metadata.userName}
                  userId={metadata.userId}
                  imagePath={metadata.imagePath}
                  views={metadata.views}
                />
              )}
              {title === 'linkedin' && (
                <LinkedInCard
                  authorName={linkedInMetadata.authorName}
                  authorBio={linkedInMetadata.authorBio}
                  followers={linkedInMetadata.followers}
                  description={linkedInMetadata.description}
                  authorImageUrl={linkedInMetadata.authorImageUrl}
                  imageUrl={linkedInMetadata.imageUrl}
                />
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}
