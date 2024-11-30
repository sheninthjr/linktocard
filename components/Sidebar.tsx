'use client';
import {
  GithubIcon,
  Home,
  LayoutDashboard,
  Linkedin,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const [isActiveId, setIsActiveId] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleClickLink = (id: string) => {
    setIsActiveId(id);
  };

  useEffect(() => {
    if (pathname === '/home') {
      setIsActiveId('home');
    } else if (pathname === '/dashboard') {
      setIsActiveId('dashboard');
    } else if (pathname === '/linkedin') {
      setIsActiveId('linkedin');
    } else if (pathname === '/github') {
      setIsActiveId('github');
    }
  }, [pathname]);

  return (
    <div className="hidden md:block">
      <div
        className="h-[88%] inset-3 rounded-xl flex justify-center pt-8 pb-8 mt-[70px] fixed backdrop-blur-lg z-10 w-16"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex flex-col justify-between items-center space-y-8 text-white">
          <div className="flex flex-col justify-center items-center space-y-8">
            <Link href="/home" onClick={() => handleClickLink('home')}>
              <div
                id="home"
                className={`p-3 rounded-full cursor-pointer ${
                  isActiveId === 'home' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <Home />
              </div>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => handleClickLink('dashboard')}
            >
              <div
                id="dashboard"
                className={`p-3 rounded-full cursor-pointer ${
                  isActiveId === 'dashboard' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <LayoutDashboard />
              </div>
            </Link>
            <Link href="/linkedin" onClick={() => handleClickLink('linkedin')}>
              <div
                id="linkedin"
                className={`p-3 rounded-full cursor-pointer ${
                  isActiveId === 'linkedin' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <Linkedin />
              </div>
            </Link>
            <Link href="/github" onClick={() => handleClickLink('github')}>
              <div
                id="github"
                className={`p-3 rounded-full cursor-pointer ${
                  isActiveId === 'github' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <GithubIcon />
              </div>
            </Link>
            {/* <Link
              href="/instagram"
              onClick={() => handleClickLink('instagram')}
            >
              <div
                id="instagram"
                className={`p-3 rounded-full cursor-pointer ${
                  isActiveId === 'instagram' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <Instagram />
              </div>
            </Link> */}
          </div>
          <button className="text-red-600">
            {session?.user.email && (
              <LogIn
                onClick={() => {
                  router.push('/api/auth/signin');
                }}
                className="text-red-400"
              />
            )}
            {!session?.user.email && (
              <LogOut
                onClick={() => {
                  router.push('/api/auth/signin');
                }}
                className="text-blue-500"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
