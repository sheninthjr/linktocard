import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <Link
      href={'https://github.com/sheninthjr/linktopost'}
      target="_blank"
      className="rounded-lg px-2 py-1 bg-slate-800 backdrop-blur-lg  bottom-1 right-1 font-sans absolute flex justify-between gap-2 items-center"
    >
      <Image
        src={'/github.png'}
        alt="github"
        width={22}
        height={22}
        className="rounded-lg"
      />
      <div className="text-neutral-300 font-montserrat text-md">
        <span className="text-neutral-400">Developed by </span>
        <span className="font-bold">Sheninth Jr</span>
      </div>
    </Link>
  );
}
