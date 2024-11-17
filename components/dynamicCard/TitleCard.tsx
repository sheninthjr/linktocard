import { usePathname } from 'next/navigation';
import { Github } from '../Icons';
import { useState } from 'react';

export function TitleCard() {
  const pathname = usePathname();
  const [activeState, setActiveState] = useState(true);

  return (
    <div>
      {pathname === '/home' && (
        <div className="flex flex-col space-y-3">
          <div className="space-x-3 flex font-mono items-center self-start">
            <img src="./yt.png" className="h-20 w-20" />
            <div className="self-center font-extrabold font-montserrat text-4xl">
              YOUTUBE
            </div>
          </div>
          <div className="bg-black text-white p-2 flex space-x-2 rounded-2xl text-lg self-start font-bold font-montserrat">
            <button
              className={`${activeState === true && 'bg-slate-800'} p-1 pl-3 pr-3 rounded-xl`}
              onClick={() => setActiveState((prev) => !prev)}
            >
              Video
            </button>
            <button
              className={`${activeState === false && 'bg-slate-800'} p-1 pl-3 pr-3 rounded-xl`}
              onClick={() => setActiveState((prev) => !prev)}
            >
              Shorts
            </button>
          </div>
        </div>
      )}
      {pathname === '/linkedin' && (
        <div className="flex flex-col space-y-5">
          <div className="space-x-3 flex font-mono items-center self-start">
            <img src="./linkedin.png" className="w-16 h-16 rounded-full" />
            <div className="self-center font-extrabold font-montserrat text-4xl">
              LINKEDIN
            </div>
          </div>
          <div className="bg-black text-white p-2 flex space-x-2 rounded-2xl text-lg self-start font-bold font-montserrat">
            <button className={`bg-slate-800 p-1 pl-3 pr-3 rounded-xl`}>
              Post
            </button>
          </div>
        </div>
      )}
      {pathname === '/github' && (
        <div className="flex flex-col space-y-3">
          <div className="space-x-3 flex font-mono items-center self-start pb-2">
            <Github className="h-16 w-16" />
            <div className="self-center font-extrabold font-montserrat text-4xl">
              GITHUB
            </div>
          </div>
          <div className="bg-black text-white p-2 flex space-x-2 rounded-2xl text-lg self-start font-bold font-montserrat">
            <button
              className={`${activeState === true && 'bg-slate-800'} p-1 pl-3 pr-3 rounded-xl`}
              onClick={() => setActiveState((prev) => !prev)}
            >
              Repository
            </button>
            <button
              className={`${activeState === false && 'bg-slate-800'} p-1 pl-3 pr-3 rounded-xl`}
              onClick={() => setActiveState((prev) => !prev)}
            >
              Pull Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
