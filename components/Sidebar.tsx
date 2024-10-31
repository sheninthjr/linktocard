'use client'
import { GithubIcon, Home, LayoutDashboard, Linkedin, LogIn, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Sidebar() {
    const [isActiveId, setIsActiveId] = useState('');
    const pathname = usePathname();

    const handleClickLink = (id: string) => {
        setIsActiveId(id);
    }

    useEffect(() => {
        if (pathname === '/home') {
            setIsActiveId('home');
        } else if (pathname === '/dashboard') {
            setIsActiveId('dashboard');
        } else if (pathname === '/youtube') {
            setIsActiveId('youtube');
        } else if (pathname === '/linkedin') {
            setIsActiveId('linkedin');
        } else if (pathname === '/github') {
            setIsActiveId('github');
        } else if (pathname === '/twitter') {
            setIsActiveId('twitter');
        }
    }, [pathname]);

    return (
        <div className="hidden md:block">
            <div className="h-[88%] inset-3 rounded-xl flex justify-center pt-8 pb-8 mt-[70px] fixed backdrop-blur-lg z-10 w-16" style={{
                background: "rgba(255, 255, 255, 0.1)",
            }}>
                <div className="flex flex-col justify-between items-center space-y-8 text-white">
                    <div className="flex flex-col justify-center items-center space-y-8">
                        <Link href="/home" onClick={() => handleClickLink('home')}>
                            <div
                                id="home"
                                className={`p-2 rounded-full cursor-pointer ${
                                    isActiveId === 'home' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <Home />
                            </div>
                        </Link>
                        <Link href="/dashboard" onClick={() => handleClickLink('dashboard')}>
                            <div
                                id="dashboard"
                                className={`p-2 rounded-full cursor-pointer ${
                                    isActiveId === 'dashboard' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <LayoutDashboard />
                            </div>
                        </Link>
                        <Link href="/youtube" onClick={() => handleClickLink('youtube')}>
                            <div
                                id="youtube"
                                className={`p-2 rounded-full cursor-pointer ${
                                    isActiveId === 'youtube' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <Youtube />
                            </div>
                        </Link>
                        <Link href="/linkedin" onClick={() => handleClickLink('linkedin')}>
                            <div
                                id="linkedin"
                                className={`p-2 rounded-full cursor-pointer ${
                                    isActiveId === 'linkedin' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <Linkedin />
                            </div>
                        </Link>
                        <Link href="/github" onClick={() => handleClickLink('github')}>
                            <div
                                id="github"
                                className={`p-2 rounded-full cursor-pointer ${
                                    isActiveId === 'github' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <GithubIcon />
                            </div>
                        </Link>
                        <Link href="/twitter" onClick={() => handleClickLink('twitter')}>
                            <div
                                id="twitter"
                                className={`p-2 rounded-full cursor-pointer ${
                                    isActiveId === 'twitter' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <Twitter/>
                            </div>
                        </Link>
                    </div>
                    <div className="text-red-600">
                        <LogIn className="text-blue-400" />
                    </div>
                </div>
            </div>
        </div>
    )
}
