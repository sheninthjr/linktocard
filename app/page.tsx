'use client';
import { motion } from 'framer-motion';
import AnimatedLogoCloud from '@/components/ImageSlider';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Stars } from '@/components/Stars';

export default function Landing() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Stars />
      <section className="flex relative flex-col gap-5 justify-center items-center max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
          className="text-center font-montserrat font-bold mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-4xl tracking-tighter sm:text-5xl text-transparent md:text-6xl lg:text-7xl"
        >
          Paste your Link{' '}
          <span className="text-transparent bg-clip-text">then just</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eece6e] to-[#ffc400]">
            Single Click
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
          className="text-center font-thin leading-tight"
        >
          <span className="text-2xl font-extrabold mr-2">LinktoPost</span>{' '}
          <span className="text-xl">
            is powerful post generator for various platforms. Simply paste your
            link and proceed with a single click. Share or download your post,
            and grab a link to send it to anyone effortlessly.
          </span>
        </motion.p>
        <Link
          href="/home"
          className="inline-flex text-lg gap-x-2 mt-2 backdrop-blur-md text-white justify-center items-center py-3 px-5 w-fit rounded-3xl border duration-200 group bg-page-gradient bg-[#1a1e33] border-white/30 text-md font-geistSans hover:border-zinc-600 hover:bg-[#161a30] hover:text-zinc-100"
        >
          Let&apos;s Go
          <div className="flex overflow-hidden relative justify-center items-center ml-1 w-5 h-5">
            <ArrowRight className="absolute" />
          </div>
        </Link>
        <AnimatedLogoCloud />
      </section>
    </div>
  );
}
