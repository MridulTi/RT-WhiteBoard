import React from 'react';
import { FaGoogle } from "react-icons/fa6";
import { RiLoginCircleFill } from "react-icons/ri";
import GoogleLogin from '../components/GoogleLogin';

function Login() {
  return (
    <div className="bg-grey-9 flex flex-col items-center justify-center gap-16 text-white w-full min-h-screen px-4">
      {/* Content Section */}
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="px-4 py-2 bg-green-700 border-t-2 border-green-500 flex gap-2 rounded-xl items-center text-lg">
          <RiLoginCircleFill /> Log In
        </p>
        <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl">
          Log into RT WHITEBOARD
        </h1>
        <p className="text-grey-1 text-sm md:text-base">
          New to Eraser? <b>Sign Up for Free</b>
        </p>
      </div>

      {/* Google Login Button */}
      <GoogleLogin/>
    </div>
  );
}

export default Login;
