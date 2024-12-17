import React from 'react'
import {Outlet} from "react-router-dom"

function MainLayout() {
  return (
    <div className='bg-gray-900 w-full h-screen'>
        <Outlet/>
    </div>
  )
}

export default MainLayout