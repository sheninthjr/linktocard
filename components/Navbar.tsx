import { Menu } from "lucide-react";

export function Navbar() {
    return(
        <div className="flex text-white inset-3 h-12 rounded-xl z-10 mt-3 backdrop-blur-lg w-[94%] md:w-fit justify-between items-center p-3 fixed" style={{
            background: "rgba(255, 255, 255, 0.1)",
          }}
  >
            <div className="text-2xl font-bold font-mono"><a href="/">L2P</a></div>
            <div className="md:hidden"><Menu /></div>
        </div>
    )
}
