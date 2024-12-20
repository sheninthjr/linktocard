'use client';
import { useState } from 'react';
import { YoutubeCard } from './YoutubeCard';
import axios from 'axios';
import { Loader } from './Loader';
import { GithubResponse, LinkedInResponse } from '@/types';
import { LinkedInCard } from './LinkedInCard';
import { GithubCard } from './GithubCard';
import { TitleCard } from './dynamicCard/TitleCard';
import { LineFalling } from './LineFalling';

export function HomePage({ title }: { title: string }) {
  const [url, setUrl] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [idState, setIdState] = useState<string>('');
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
  const [githubMetadata, setGithubMetadata] = useState<GithubResponse>({
    title: '',
    description: '',
    userName: '',
    avatar: '',
    image: '',
    prStatus: '',
    repoName: '',
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
    } else if (title === 'github') {
      if (idState === 'pr') {
        const response = await axios.post('api/github/pr', { url });
        setGithubMetadata({
          title: response.data.title,
          description: response.data.description,
          userName: response.data.userName,
          avatar: response.data.avatar,
          image: response.data.image,
          prStatus: response.data.prStatus,
          repoName: response.data.repoName,
        });
      } else {
        const response = await axios.post('api/github', { url });
        setGithubMetadata({
          title: response.data.title,
          description: response.data.description,
          userName: response.data.userName,
          avatar: response.data.avatar,
          image: response.data.image,
          prStatus: response.data.prStatus,
          repoName: response.data.repoName,
        });
      }
    }
    setIsLoading(false);
    setButtonClicked(true);
  };
  return (
    <div className="xl:w-[90%] md:pr-10 lg:pl-16 md:pl-16 lg:pr-10 h-screen flex mx-auto flex-col w-full lg:flex-row justify-center items-center rounded-2xl shadow-lg space-y-10 md:space-y-0 pb-10 md:pb-0 overflow-y-auto">
      <div
        className={`lg:w-1/2 pl-3 h-[100%] ${buttonClicked || isLoading ? 'mt-[650px] md:mt-[600px]' : 'mt-8'} lg:mt-0 flex md:p-8 flex-col space-y-8 md:space-y-16 justify-center items-center rounded-l-xl`}
      >
        <div className="self-center lg:self-start flex flex-col space-y-2 md:space-y-4">
          <TitleCard onIdChange={setIdState} setUrl={setUrl} />
        </div>
        <div className="self-start flex flex-col space-y-3">
          <div className="font-extrabold text-3xl md:text-5xl lg:text-6xl xl:text-7xl self-center lg:text-center lg:self-start font-montserrat">
            Just Paste & Click!
          </div>
          <h1 className="text-zinc-400 text-xl md:text-2xl m-2 self-center md:self-start text-center font-notosans leading-tight">
            Make your link look great. Just turn it into a post!
          </h1>
        </div>
        <input
          type="text"
          className="p-4 border border-slate-500 text-white text-lg xl:self-start outline-none w-[97%] lg:w-[90%] self-center rounded-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
          }}
          placeholder="Paste your URL here"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleButtonClick();
            }
          }}
        />
        <button
          className="text-black text-lg self-center xl:mr-20 font-semibold py-2 px-6 rounded-2xl transition duration-300 bg-white border border-slate-700"
          onClick={handleButtonClick}
        >
          Generate
        </button>
      </div>
      <div className="hidden lg:block">
        <LineFalling />
      </div>
      <div className="flex justify-center items-center self-center rounded-r-2xl md:pl-20 lg:pl-0 xl:pl-0 w-full md:w-1/2">
        {!isLoading && !buttonClicked && (
          <span className="font-bold text-center self-center text-xl">
            Once you generate the post will appear here
          </span>
        )}
        {isLoading ? (
          <Loader />
        ) : (
          buttonClicked && (
            <div className="">
              {title === 'youtube' && (
                <YoutubeCard
                  id={idState}
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
              {title === 'github' && (
                <GithubCard
                  title={githubMetadata.title}
                  description={githubMetadata.description}
                  userName={githubMetadata.userName}
                  avatar={githubMetadata.avatar}
                  image={githubMetadata.image}
                  prStatus={githubMetadata.prStatus}
                  repoName={githubMetadata.repoName}
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
