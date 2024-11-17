'use client';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

const Dashboard = () => {
  const { data: session } = useSession();
  const [activeState, setActiveState] = useState('youtube');

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
    <div className="flex justify-start ml-32 pt-28 items-start h-screen self-start w-full">
      <div className="flex flex-col space-y-4">
        <div className="font-extrabold font-montserrat text-5xl ml-2">
          Dashboard
        </div>
        <div className="flex gap-10 font-roboto text-xl">
          <SocialButton
            platform="Youtube"
            isActive={activeState === 'youtube'}
            onClick={() => setActiveState('youtube')}
          />
          <SocialButton
            platform="LinkedIn"
            isActive={activeState === 'linkedin'}
            onClick={() => setActiveState('linkedin')}
          />
          <SocialButton
            platform="Github"
            isActive={activeState === 'github'}
            onClick={() => setActiveState('github')}
          />
          <SocialButton
            platform="Instagram"
            isActive={activeState === 'instagram'}
            onClick={() => setActiveState('instagram')}
          />
        </div>
        <div className="mt-8 ml-3">
          <h2 className="text-2xl font-semibold">{activeState} Content</h2>
          <p>Details about {activeState} would go here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
