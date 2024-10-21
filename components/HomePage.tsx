import { Card } from "./Card";

export function HomePage() {
    return (
        <div className="w-[80%] flex mx-auto justify-center items-center rounded-2xl shadow-lg overflow-hidden">
            <div className="w-1/2 flex p-8 flex-col justify-center space-y-16 h-fit items-center rounded-l-xl">
                <h1 className="text-white text-5xl font-extrabold font-serif"><span className="text-7xl">L</span>inkTo<span className="text-7xl">P</span>ost</h1>
                <h1 className="text-white text-4xl font-extrabold text-center font-serif leading-tight mb-6">
                    Instantly Turn Your Link into a Stunning Visual Post. Just Paste & Click!
                </h1>
                <input
                    type="text"
                    className="p-3 bg-black/20 border border-slate-700 text-white text-lg outline-none w-[80%] rounded-lg mb-4"
                    placeholder="Paste your URL here"
                />
                <button className="text-white font-semibold py-3 px-6 rounded-full transition duration-300 bg-black/60 border border-slate-700">
                    Generate
                </button>
            </div>
            <div className="flex justify-center items-center self-center rounded-r-2xl h-screen w-1/2 p-8">
                <Card />
            </div>
        </div>
    );
}
