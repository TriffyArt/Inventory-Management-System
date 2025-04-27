import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
        <header className="flex max-h-screen">
                    <nav className="flex flex-row items-center gap-10 p-4 w-full text-gray-700 font-sans mx-20">
    
                        <h2 className="text-2xl font-bold text-black cursor-pointer">InvenTrack</h2>
    
                        <ul className="flex flex-row gap-14 text-xl m-auto p-auto font-semibold">
                            <li className="text-black transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110">
                                <Link to='/admin'>Dashboard</Link>
                            </li>
    
                            <li className="text-black transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110">
                                <Link to='/admin/products' className="hover:text-black">Products</Link>
                            </li>
                        </ul>
    
                        <button className="font-bold text-black rounded-lg text-sm bg-gray-100 w-20 py-1 border-1 black cursor-pointer
                         transition duration-300 ease-in-out hover:bg-black hover:text-white hover:scale-100 animate-slide-in cursor-pointer"
                         onClick={() => navigate('/admin-login')}>
                                Sign Out
                        </button>
    
                    </nav>
                </header>
        </>
  );
};

export default Navbar;