import React, { useCallback } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { FaRegHand, FaArrowPointer, FaImage, FaEraser, FaRegCircleQuestion, FaArrowRightLong, FaPencil } from "react-icons/fa6";
import { LuRectangleHorizontal, LuDiamond, LuCircle, LuMinus, LuPlus } from "react-icons/lu";
import { MdFormatColorText, MdOutlineMenu, MdOutlineUndo, MdRedo } from "react-icons/md";
import { GiStraightPipe } from "react-icons/gi";
import { ACTIONS } from '../constants';
import { useActions } from '../hooks/useActions';
import { ShareLink } from '@/components/ShareLink.tsx';
import { Toaster } from '@/components/ui/toaster';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useAuth from '../hooks/useAuth';

function Layout() {
  const {logout}=useAuth()
  const { action, setAction, setActions,stageScale ,handleZoom,zoomLevel} = useActions();
 
  return (
    <div className='my-2 mx-4'>
      <nav className='fixed top-2 left-4 w-[98vw] z-10 flex justify-between'>
        <Popover>
          <PopoverTrigger >
            <MdOutlineMenu className='text-4xl shadow-lg flex place-items-center hover:bg-indigo-300 hover:text-black text-gray-600 p-2 rounded-lg bg-indigo-200' />
          </PopoverTrigger>
          <PopoverContent className='w-48 lg:w-52'>
          <button onClick={logout} className='bg-indigo-200 font-semibold hover:bg-red-500 hover:text-white w-full p-2 rounded-lg'>Sign Out</button>
          </PopoverContent>
        </Popover>

        <ul className=' py-2 bg-indigo-200 w-1/2 lg:w-1/4 rounded-xl text-gray-600 flex justify-evenly'>
          <li onClick={() => setAction(ACTIONS.HAND)} className={`text-lg hover:bg-white hover:text-black  p-2 rounded-lg  font-bold ${ACTIONS.HAND === action ? "bg-white text-black" : ""} `}><FaRegHand /></li>
          <li onClick={() => setAction(ACTIONS.SELECT)} className={`text-lg hover:bg-white p-2 rounded-lg hover:text-black font-bold ${ACTIONS.SELECT === action ? "bg-white text-black" : ""} `}><FaArrowPointer /></li>
          <li onClick={() => setAction(ACTIONS.RECTANGLE)} className={`text-lg hover:bg-white p-2 rounded-lg hover:text-black font-bold ${ACTIONS.RECTANGLE === action ? "bg-white text-black" : ""} `}><LuRectangleHorizontal /></li>
          <li className={`text-lg p-2 opacity-25 rounded-lg cursor-not-allowed font-bold `}><LuDiamond /></li>
          <li onClick={() => setAction(ACTIONS.CIRCLE)} className={`text-lg hover:bg-white p-2 rounded-lg hover:text-black font-bold ${ACTIONS.CIRCLE === action ? "bg-white text-black" : ""} `}><LuCircle /></li>
          <li className={`text-lg opacity-25 p-2 rounded-lg font-bold cursor-not-allowed`}><GiStraightPipe /></li>
          <li onClick={() => setAction(ACTIONS.ARROWRIGHT)} className={`text-lg hover:bg-white p-2 rounded-lg hover:text-black font-bold ${ACTIONS.ARROWRIGHT === action ? "bg-white text-black" : ""} `}><FaArrowRightLong /></li>
          <li onClick={() => setAction(ACTIONS.SCRIBBLE)} className={`text-lg hover:bg-white p-2 rounded-lg hover:text-black font-bold ${ACTIONS.SCRIBBLE === action ? "bg-white text-black" : ""} `}><FaPencil /></li>
          <li className={`text-lg  p-2 rounded-lg  cursor-not-allowed opacity-25 font-bold `}><MdFormatColorText /></li>
          <li className={`text-lg  p-2 rounded-lg  cursor-not-allowed opacity-25 font-bold `}><FaImage /></li>
          <li className={`text-lg  p-2 rounded-lg  cursor-not-allowed opacity-25 font-bold  `}><FaEraser /></li>
        </ul>
        <ul className=''>
          <ShareLink />
        </ul>
      </nav>
      <Outlet />
      <footer className=' fixed bottom-3 w-[95vw] lg:w-[98vw] flex justify-between'>
        <ul className='flex items-center gap-4'>
          {/* Zoom Slider */}
          <div className="bg-gray-100 shadow-md p-2 rounded-md shadow-md z-10">
            <label htmlFor="zoom">Zoom: {zoomLevel}%</label>
            <input
              id="zoom"
              type="range"
              min="10"
              max="300"
              value={zoomLevel}
              onChange={handleZoom}
            />
          </div>
          {/* <li className='flex items-center'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <MdOutlineUndo className='text-4xl flex place-items-center hover:bg-indigo-300 hover:text-black text-gray-600 p-2 rounded-tl-lg rounded-bl-lg bg-indigo-200' />           
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <MdRedo className='text-4xl flex place-items-center hover:bg-indigo-300 hover:text-black text-gray-600 p-2 rounded-tr-lg rounded-br-lg bg-indigo-200' />            
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li> */}

        </ul>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaRegCircleQuestion className='text-4xl shadow-lg flex place-items-center hover:bg-indigo-300 hover:text-black text-gray-600 p-2 rounded-lg bg-indigo-200' />
            </TooltipTrigger>
            <TooltipContent>
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </footer>
      <Toaster />
    </div>
  )
}

export default Layout