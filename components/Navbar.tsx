'use client';
import { useEffect, useState } from 'react';
import {
  Github,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  X,
  Linkedin,
  LogOut,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import LiveUser from './LiveUser/LiveUser';

export function Navbar() {
  const { data: session } = useSession();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isActiveId, setIsActiveId] = useState('');
  const pathname = usePathname();

  const handleClickLink = (id: string) => {
    setIsSidebarVisible(false);
    setIsActiveId(id);
  };

  useEffect(() => {
    if (pathname === '/home') {
      setIsActiveId('home');
    } else if (pathname === '/dashboard') {
      setIsActiveId('dashboard');
    } else if (pathname === '/github') {
      setIsActiveId('github');
    } else if (pathname === '/linkedin') {
      setIsActiveId('linkedin');
    }
  }, [pathname]);
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <div className="hidden absolute top-0 right-0 p-6 md:flex gap-2 items-center">
        {session?.user && (
          <div className="bg-neutral-800 self-center rounded-full p-1.5 w-fit">
            <Image
              src={session?.user?.image || ''}
              alt="User Image"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        )}
        <LiveUser />
      </div>
      <div
        className="flex text-white inset-3 h-12 rounded-xl z-10 mt-3 backdrop-blur-lg w-[94%] md:w-fit justify-between items-center p-3 fixed"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="text-2xl font-bold font-mono">
          <a href="/">L2P</a>
        </div>
        <div className="md:hidden" onClick={toggleSidebar}>
          {isSidebarVisible ? <X /> : <Menu />}
        </div>
      </div>
      {isSidebarVisible && (
        <div className="fixed ml-3 top-[5em] mt-2 left-0 w-[94%] rounded-2xl z-10 backdrop-blur-lg bg-white bg-opacity-10 p-4 md:hidden">
          <div className="flex flex-col space-y-4 text-white">
            <Link href="/home" onClick={() => handleClickLink('home')}>
              <div
                id="home"
                className={`p-2 pl-3 rounded-full self-center flex text-white font-bold gap-4 text-xl cursor-pointer ${
                  isActiveId === 'home' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <Home /> Home
              </div>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => handleClickLink('dashboard')}
            >
              <div
                id="dashboard"
                className={`p-2 pl-3 rounded-full self-center flex text-white font-bold gap-4 text-xl  cursor-pointer ${
                  isActiveId === 'dashboard' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <LayoutDashboard /> Dashboard
              </div>
            </Link>
            <Link href="/github" onClick={() => handleClickLink('github')}>
              <div
                id="github"
                className={`p-2 pl-3 rounded-full self-center flex text-white font-bold gap-4 text-xl cursor-pointer ${
                  isActiveId === 'github' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <Github /> Github
              </div>
            </Link>
            <Link href="/linkedin" onClick={() => handleClickLink('linkedin')}>
              <div
                id="linkedin"
                className={`p-2 pl-3 rounded-full self-center flex text-white font-bold gap-4 text-xl cursor-pointer ${
                  isActiveId === 'linkedin' ? 'bg-slate-950' : 'bg-transparent'
                }`}
              >
                <Linkedin /> LinkedIn
              </div>
            </Link>
            <div className="flex gap-4 ml-2 font-bold text-xl items-center">
              {session?.user.name ? (
                <div
                  className="flex gap-3"
                  onClick={async () => {
                    await signOut({ redirect: false });
                  }}
                >
                  <LogOut className="ml-2" /> <span>Logout</span>
                </div>
              ) : (
                <div
                  className="flex gap-3"
                  onClick={async () => {
                    await signIn();
                  }}
                >
                  <LogIn className="ml-2" /> <span>Login</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
