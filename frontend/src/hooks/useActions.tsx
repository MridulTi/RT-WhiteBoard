import React, { createContext, useState, useContext, useRef } from 'react';
import { ACTIONS } from '../constants';

// Create the context
const ActionsContext = createContext(null);

// Create a provider component
export const ActionsProvider: React.FC = ({ children }) => {
    const [action, setActions] = useState(ACTIONS);
    const isDraggable=action===ACTIONS.SELECT;
    const [stageScale, setStageScales] = useState(1);
    const stageRef = useRef();
    const [zoomLevel, setZoomLevel] = useState(100); // Zoom level state (percentage)
    const [isLogin,setLogin]=useState<boolean>(false);

    
    function setAction(data:any){
        setActions(data);
    }
    function setStageScale(data:any){
        setStageScales(data);
    }
    const handleZoom = (e) => {
        const scale = e.target.value / 100;
        const stage = stageRef.current;
        stage.scale({ x: scale, y: scale });
        stage.batchDraw();
        setZoomLevel(e.target.value);
    };
    function setLogins(data:boolean){
        setLogin(data);
    }

    return (
        <ActionsContext.Provider value={{isLogin,setLogins, action,stageRef,stageScale,zoomLevel,handleZoom,setStageScale,setStageScales, setAction,setActions,isDraggable }}>
            {children}
        </ActionsContext.Provider>
    );
};

// Custom hook to use the Actions context
export const useActions = () => {
    const context = useContext(ActionsContext);
    if (!context) {
        throw new Error("useActions must be used within an ActionsProvider");
    }
    return context;
};
