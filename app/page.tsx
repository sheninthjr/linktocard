'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const iconVariant = (x: number, y: number) => ({
  hidden: { opacity: 0, x, y, scale: 0 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 10 },
  },
});

const characterVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 10 },
  },
};

const containerVariant = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

export default function Landing() {
  const router = useRouter();
  const title = 'LINKTOPOST';

  return (
    <div className="flex flex-col justify-center overflow-hidden items-center h-screen text-white">
      <motion.div
        className="font-extrabold mb-4 font-montserrat flex items-end"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        {title.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={characterVariant}
            className="font-extrabold text-8xl"
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      <div
        className="text-lg m-3 text-neutral-400 md:text-2xl mb-8 text-justify"
        style={{ fontFamily: 'Roboto, sans-serif' }}
      >
        Turn your URL into a sharable post across multiple platforms!
      </div>

      <button
        onClick={() => router.push('/home')}
        className="mt-6 bg-white text-black font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
      >
        Get Started
      </button>

      <motion.div
        className="flex space-x-10 mt-12"
        variants={containerVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariant(-500, -500)}
          whileHover={{ scale: 1.5, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <img
            src="/twitter.png"
            alt="Twitter"
            className="w-20 bg-white rounded-lg border h-20"
          />
        </motion.a>

        <motion.a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariant(500, -500)}
          whileHover={{ scale: 1.5, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <img src="/insta.webp" alt="Instagram" className="w-20 h-20" />
        </motion.a>
        <motion.a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariant(0, 500)}
          whileHover={{ scale: 1.5, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <img src="/yt.png" alt="YouTube" className="w-24 h-24" />
        </motion.a>

        <motion.a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariant(-500, 500)}
          whileHover={{ scale: 1.5, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <img
            src="/linkedin.png"
            alt="LinkedIn"
            className="w-20 rounded-full h-20"
          />
        </motion.a>

        <motion.a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          variants={iconVariant(500, 500)}
          whileHover={{ scale: 1.5, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <img src="/face.png" alt="Facebook" className="w-20 h-20" />
        </motion.a>
      </motion.div>
    </div>
  );
}
