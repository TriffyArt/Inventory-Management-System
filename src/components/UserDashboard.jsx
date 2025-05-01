import React from 'react';

const UserDashboard = () => {
  return (
    <div className="mx-20 h-auto w-auto justify-around  items-center flex flex-col border-2 black rounded-xl bg-gray-400
                bg-gradient-to-b from-white via-gray-300 to-gray-400">

        <div className='flex flex-row m-5'>
          <div className="bg-white w-90 h-auto font-sans rounded-3xl border-2 black mt-6 mr-16 p-20"></div>
          <div className="bg-white w-160 h-auto font-sans rounded-3xl border-2 black mt-6 p-20"></div>
        </div>

        <div className='bg-white w-268 h-auto font-sans rounded-3xl border-2 black mb-10  p-36'>
        </div>
    </div>
  )
};

export default UserDashboard;