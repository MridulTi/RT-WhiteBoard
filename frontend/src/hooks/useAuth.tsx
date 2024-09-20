import Keycloak from 'keycloak-js';
import React, { useEffect, useState,useRef } from 'react'


function useAuth() {
    const isRun=useRef(false)
    const [token,setToken]=useState<string|undefined>(undefined);
    const [isLogin,setLogin]=useState<boolean>(true);

    useEffect(()=>{
        if (isRun.current) return;

        isRun.current=true;
        const client:Keycloak=new Keycloak({
            url:import .meta.env.VITE_KEYCLOAK_URL,
            realm:import.meta.env.VITE_KEYCLOAK_REALM,
            clientId:import.meta.env.VITE_KEYCLOAK_CLIENT_ID
        });

        client.init({onLoad:"login-required"})
        .then((res:any)=>{
            setLogin(res)
            setToken(client.token)
        })
    },[])

    return [isLogin,token]
}

export default useAuth