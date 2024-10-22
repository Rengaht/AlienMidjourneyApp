import { useEffect, useRef, useState } from "react";
import { selectListener } from "../utils";
import { useControls, button, Leva } from 'leva'
import { useParams } from "react-router-dom";

const __tag="INNER_ALIEN_PARAMS_DISPLAY";
const Compare=()=>{


    const [currentLeft, setCurrentLeft]=useState();
    const [currentRight, setCurrentRight]=useState();


    useEffect(()=>{
        
        selectListener((data)=>{
            setCurrentLeft(()=>data);
        }, 'left');
        selectListener((data)=>{
            setCurrentRight(()=>data);
        }, 'right');

        // document.addEventListener('keydown', function(event){
        //     // event.preventDefault();
        //     console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
        //     if(event.key=='q' || event.key=='Q'){
        //        let now=new Date();
        //        if(now-refLast.current<100) return;
        //        setControl(val=>!val);    
        //        refLast.current=now;         
        //     }
        // }, false);

    },[]);

    
    return (
        <div className="bg-black absolute top-0 left-0 bottom-0 right-0 flex flex-col py-[0.5rem] justify-between gap-[1.5rem] items-center">
                <img className="w-[37%]" src="/assets/scale_graphic.png"/>
                <div className="w-full flex-1 flex flex-row">
                    <div className="flex-1 flex flex-col gap-[1rem] justify-start items-center">
                        <div className="w-[75vh] aspect-square bg-center bg-cover bg-no-repeat rounded-full"
                            style={{backgroundImage:`url(${currentLeft?.url})`}}>
                        </div>
                        <div>{currentLeft?.prompt}</div>
                    </div>
                    <div className="flex-1 flex flex-col gap-[1rem] justify-start items-center">
                        <div className="w-[75vh] aspect-square bg-center bg-cover bg-no-repeat rounded-full"
                            style={{backgroundImage:`url(${currentRight?.url})`}}>
                        </div>                        
                        <div>{currentRight?.prompt}</div>
                    </div>                    
                </div>
                <img className="w-[46%]"  src="/assets/gradient_graphic.png"/>
            
        </div>
        
    )
}
export default Compare;