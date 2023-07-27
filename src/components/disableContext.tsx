import React from "react";
import {useEffect} from "react";

const DisableContext = () => {
    const disableContextMenu = (e: any) => {
        e.preventDefault();
        return;
    }

    useEffect(()=>{
        window.addEventListener("contextmenu", disableContextMenu);
        return () => {
            window.removeEventListener("contextmenu", disableContextMenu);
        }
    }, [])

    return <React.Fragment/>
}

export default DisableContext;
