import { createContext, useContext, useState } from "react";

const AppContext=createContext(null)

export const AppProvider=({children})=>{
    const [loggedin,setLoggedIn]=useState(false);
    const [currentUser,setCurrentUser]=useState(null);
    const [accessToken, setAccessToken] = useState(null);

    return(
        <AppContext.Provider value={{
            loggedin,setLoggedIn,
            currentUser,setCurrentUser,
            accessToken, setAccessToken
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp=()=>useContext(AppContext)