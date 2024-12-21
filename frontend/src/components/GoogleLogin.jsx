import React from "react";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { googleAuth } from "../services/api";
import { FcGoogle } from "react-icons/fc";
import { useApp } from "../context/AppContext";

export default (props) => {
  const { currentUser, setCurrentUser,setAccessToken } = useApp();
  const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
];
  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        setAccessToken(result.data.data.accessToken)
        setCurrentUser(result.data.data.currentUser);
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log(e);
    }
  };


  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError:responseGoogle,
    flow: "auth-code",
    scope: SCOPES.join(' ')
  });


  return (
    <button
      className="px-10 py-5 bg-grey-6 hover:bg-grey-7 w-64 flex items-center rounded-md justify-center gap-4"
      onClick={googleLogin}
    >
      <FcGoogle /> Log in with Google
    </button>
  );
};
