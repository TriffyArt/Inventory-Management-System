import { useNavigate } from "react-router-dom";

const LoginInterface = () => {
    const navigate = useNavigate();
    return (
        <div className="mx-20 h-auto w-auto pb-36 pt-10  flex flex-col items-center border-2 black rounded-xl bg-gray-400
          bg-gradient-to-b from-white via-gray-300 to-gray-400 font-serif">

            <h1 className="font-semibold text-3xl pb-10">
                Login
            </h1>
            
            <div className="flex flex-row text-center w-auto">
                <div onClick={() => navigate('/admin-login')} className="bg-white border-2 p-18 mx-2 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform duration-300">
                    <img src="/admin.png" alt="Admin Icon" className="h-auto w-30" />
                    <h1 className="font-semibold text-2xl">Admin</h1>
                </div>
            </div>

        </div>
    )
}

export default LoginInterface;