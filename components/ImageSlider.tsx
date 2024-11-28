import { Youtube } from 'lucide-react';
import { Github, LinkedIn } from './Icons';

const logos = [
  {
    name: 'Youtube',
    url: <Youtube className="w-16 h-16 brightness-100 invert-1 mx-10" />,
  },
  {
    name: 'Github',
    url: <Github className="w-16 h-16 brightness-100 invert-1 mx-10" />,
  },
  {
    name: 'LinkedIn',
    url: <LinkedIn className="w-16 h-16 brightness-100 invert-1 mx-10" />,
  },
];

const AnimatedLogoCloud = () => {
  return (
    <div className="py-2 max-w-4xl scale-75">
      <p className="font-normal tracking-tighter text-xl text-gray-100 bg-gradient-to-br from-zinc-400 via-zinc-300 to-zinc-700 bg-clip-text text-transparent text-center mt-4">
        L2P will work for these Apps
      </p>
      <div className="relative bg-page-gradient h-full mx-auto max-w-full mt-14">
        <div className="absolute z-40 mx-auto  h-screen  overflow-hidden bg-inherit bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="px-4 mx-auto w-full md:px-8 relative ">
        <div
          className="flex overflow-hidden relative gap-6 p-2 mt-[-40px] group"
          style={{
            maskImage:
              'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)',
          }}
        >
          {Array(5)
            .fill(null)
            .map((index) => (
              <div
                key={`animated-logo-cloud-${index}`}
                className="flex flex-row gap-5 justify-around items-center animate-logo-cloud shrink-0"
              >
                {logos.map((logo) => (
                  <>{logo.url}</>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedLogoCloud;
