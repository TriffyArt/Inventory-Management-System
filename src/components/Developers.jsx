const Developers = () => {
    return (
        <div className="mx-4 md:mx-20 w-auto flex flex-col items-center justify-start border-2 border-black rounded-xl bg-gradient-to-b from-white via-gray-200 to-gray-400 pb-10 pt-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-10">Developers</h1>
            
            <div className="flex flex-wrap gap-10 justify-center w-full">
                <div className="flex flex-col items-center">
                    <a href="https://github.com/TriffyArt" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://avatars.githubusercontent.com/u/180009427?v=4"
                            alt="TriffyArt"
                            className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-2 border-white hover:scale-105 transition-transform duration-300"
                        />
                    </a>
                    <p className="mt-2 font-medium text-sm md:text-base">TriffyArt</p>
                    <p className="text-gray-600 text-xs md:text-sm text-center">Backend and UI/UX</p>
                </div>

                <div className="flex flex-col items-center">
                    <a href="https://github.com/KntMrbd" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://avatars.githubusercontent.com/u/196512083?v=4"
                            alt="KntMrbd"
                            className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-2 border-white hover:scale-105 transition-transform duration-300"
                        />
                    </a>
                    <p className="mt-2 font-medium text-sm md:text-base">KntMrbd</p>
                    <p className="text-gray-600 text-xs md:text-sm">Frontend</p>
                </div>

                <div className="flex flex-col items-center">
                    <a href="https://github.com/DonnTech" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://avatars.githubusercontent.com/u/169155994?v=4"
                            alt="DonnTech"
                            className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-2 border-white hover:scale-105 transition-transform duration-300"
                        />
                    </a>
                    <p className="mt-2 font-medium text-sm md:text-base">DonnTech</p>
                    <p className="text-gray-600 text-xs md:text-sm">Frontend and Database </p>
                </div>
            </div>
        </div>
    );
};

export default Developers;
