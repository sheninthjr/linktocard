'use client';
import { useEffect, useState } from "react";
import { ContactRoundIcon, Home, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
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
        }
    }, [pathname]);
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div>
            <div className="flex text-white inset-3 h-12 rounded-xl z-10 mt-3 backdrop-blur-lg w-[94%] md:w-fit justify-between items-center p-3 fixed" style={{
                background: "rgba(255, 255, 255, 0.1)",
            }}>
                <div className="text-2xl font-bold font-mono">
                    <a href="/">L2P</a>
                </div>
                <div className="md:hidden" onClick={toggleSidebar}>
                    {isSidebarVisible ? <X /> : <Menu />}
                </div>
            </div>
            {isSidebarVisible && (
                <div className="fixed ml-3 top-[5em] left-0 w-[94%] rounded-2xl z-10 backdrop-blur-lg bg-white bg-opacity-10 p-4 md:hidden">
                    <div className="flex flex-col space-y-4 text-white">
                    <Link href="/home" onClick={() => handleClickLink('home')}>
                            <div
                                id="home"
                                className={`p-2 pl-3 rounded-full self-center flex text-white font-bold gap-4 text-xl cursor-pointer ${
                                    isActiveId === 'home' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <Home /> Home
                            </div>
                        </Link>
                        <Link href="/dashboard" onClick={() => handleClickLink('dashboard')}>
                            <div
                                id="dashboard"
                                className={`p-2 pl-3 rounded-full self-center flex text-white font-bold gap-4 text-xl  cursor-pointer ${
                                    isActiveId === 'dashboard' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <LayoutDashboard /> Dashboard
                            </div>
                        </Link>
                        <Link href="/contact" onClick={() => handleClickLink('contact')}>
                            <div
                                id="contact"
                                className={`p-2 pl-3 rounded-full self-center flex text-white font-bold gap-4 text-xl cursor-pointer ${
                                    isActiveId === 'contact' ? 'bg-blue-500' : 'bg-transparent'
                                }`}
                            >
                                <ContactRoundIcon /> Contact
                            </div>
                        </Link>
                        <div className="flex gap-4 font-bold text-xl items-center"><LogIn className="text-blue-400 ml-2" /> Login</div>
                    </div>
                </div>
            )}
        </div>
    );
}
