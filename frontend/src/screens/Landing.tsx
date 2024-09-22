import useAuth from '@/hooks/useAuth';
import React, { useCallback } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


function Landing() {

  function handleLogin(){
    
  }


  return (
    
    <div className='bg-gray-900 w-screen h-screen'>
      {/* Navigation */}
      <nav className='flex w-full justify-between px-4 sm:px-6 lg:px-52 py-4 text-white'>
        <h1 className="text-xl sm:text-2xl font-bold">RT WHITEBOARD</h1>
        <ul className="flex text-sm sm:text-md gap-2 justify-between text-black items-center">
        <Link to="/login"><li className="font-bold rounded-lg p-2 cursor-pointer hover:bg-indigo-300 px-4 bg-indigo-100">Login</li></Link>
        <Link to="/login"><li className="font-bold rounded-lg px-4 sm:px-6 cursor-pointer hover:bg-gray-200 flex gap-2 items-center p-2 bg-white">
            Try Whiteboard <FaArrowRightLong />
          </li></Link>
        </ul>
      </nav>

      {/* Main Content */}
      <div className='w-full text-white grid place-items-center py-32 sm:py-40 lg:py-64 bg-blue-950'>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white w-full px-4 sm:px-0 lg:w-1/2 text-center">
          <b className='text-indigo-400'>Documents & Diagram</b> Whiteboarding for teams
        </h1>
        <p className='text-lg sm:text-2xl lg:text-3xl font-semibold text-center w-5/6 lg:w-1/3 pt-4'>
          All-in-one whiteboard, collaborative canvas, development flow-charts for teams.
        </p>
        <Link to="/login"><li className="font-bold flex gap-2 text-black px-4 sm:px-6 mt-6 cursor-pointer hover:bg-gray-200 rounded-lg items-center py-3 sm:py-4 bg-white">
          Try Whiteboard <FaArrowRightLong />
        </li>
        </Link>
        
      </div>
    </div>
  );
}

export default Landing;
