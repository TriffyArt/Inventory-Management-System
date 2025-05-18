import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/features');
    };
    return (
        <div className="mx-20 h-auto w-auto flex flex-col items-center border-2 black rounded-xl bg-gray-400
                bg-gradient-to-b from-white via-gray-300 to-gray-400">

                <h1 className="text-6xl font-bold mt-40 mb-28 animate-pulse">GET STARTED</h1>

                <button onClick={handleClick}
                className="rounded-2xl w-40 h-10 text-lg font-light bg-white border-1 black mb-46
                transition duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-105 animate-slide-in cursor-pointer
                ">Click Here</button>
            </div>
    )
}

export default Home;