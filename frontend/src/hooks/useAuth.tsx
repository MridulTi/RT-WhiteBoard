import { useEffect, useRef, useState } from "react";
import Keycloak from "keycloak-js";
import getKeycloakInstance from "../utils/keycloak";


const useAuth=()=>{
    const client = getKeycloakInstance();
    const isRun=useRef(false);
    const [isLogin,setLogin]=useState(false);
    
    useEffect(()=>{
        const initKeycloak=async()=>{
            try{
                if (!isRun.current){
                    isRun.current=true;
                    await client
                    .init({
                        onLoad:"login-required",
                    })
                    .then((res)=>{
                        setLogin(res);
                    })
                    .catch((err) => {
                        console.error("Keycloak initialization failed:", err);
                    });
                }
            }catch (error) {
                console.error('Failed to initialize adapter:', error);
            }
        }
        initKeycloak();
        
    },[])
    const logout = () => {
        console.log("LOGOUT")
        client.logout();
    };

    return { isLogin, logout };
}
export default useAuth