'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Post } from '@/types';
import Link from 'next/link';

const Dashboard = () => {
  const [activeState, setActiveState] = useState('YOUTUBE');
  const [posts, setPosts] = useState<Post[]>([]);
  const { data: session } = useSession();
  const email = session?.user.email;

  const fetchPosts = async (platform: string) => {
    try {
      const response = await axios.post('/api/user', { email, platform });
      if (response.data && response.data.post) {
        setPosts(response.data.post);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  useEffect(() => {
    if (email) {
      fetchPosts(activeState);
    }
  }, [activeState, email]);

  const SocialButton = ({
    platform,
    isActive,
    onClick,
  }: {
    platform: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={`cursor-pointer pl-3 pr-3 pt-1 pb-1 self-center rounded-xl transition-transform duration-500 ease-in-out ${isActive ? 'scale-105' : ''}`}
      style={{
        backgroundColor: isActive ? '#262A33' : '',
        color: isActive ? 'white' : '',
        transition: 'background-color 0.5s ease',
      }}
    >
      {platform}
    </div>
  );

  return (
    <div className="flex justify-start ml:4 md:ml-32 pt-28 items-start h-screen self-start w-full overflow-y-auto">
      <div className="flex flex-col space-y-4">
        <div className="font-extrabold font-montserrat text-5xl ml-3 md:ml-0">
          Dashboard
        </div>
        <div className="flex gap-6 md:gap-10 font-roboto text-lg md:text-xl ml-3 md:ml-0 self-center md:self-start">
          <SocialButton
            platform="YOUTUBE"
            isActive={activeState === 'YOUTUBE'}
            onClick={() => setActiveState('YOUTUBE')}
          />
          <SocialButton
            platform="LINKEDIN"
            isActive={activeState === 'LINKEDIN'}
            onClick={() => setActiveState('LINKEDIN')}
          />
          <SocialButton
            platform="GITHUB"
            isActive={activeState === 'GITHUB'}
            onClick={() => setActiveState('GITHUB')}
          />
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
            {posts.length > 0 ? (
              posts.map((post: Post) => (
                <div
                  key={post.id}
                  className="w-[360px] md:w-[380px] rounded-2xl overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={post.postUrl}
                      alt="Thumbnail"
                      className="w-full object-cover h-fit rounded-t-2xl"
                    />
                  </div>
                </div>
              ))
            ) : email ? (
              <p className="text-neutral-300 text-lg font-montserrat">
                No posts found for this platform
              </p>
            ) : (
              <Link
                href={'/api/auth/signin'}
                className="text-neutral-300 text-lg"
              >
                Login to save your post
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
