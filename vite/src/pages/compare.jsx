import { useEffect, useRef, useState } from "react";
import { selectListener } from "../utils";
import { useControls, button, Leva } from 'leva'
import { useParams } from "react-router-dom";

const __tag="INNER_ALIEN_PARAMS_DISPLAY";
const Compare=()=>{

    const { index }=useParams();

    const reset=()=>{
        console.log('reset');
        localStorage.removeItem(__tag);

        let w=window.innerWidth;
        let h=window.innerHeight;
        let r=Math.min(w, h);

        let params={
            x: w/2-r/2,
            y: h/2-r/2,
            radius: r,
            angle: 0,
        };
        localStorage.setItem(__tag, JSON.stringify(params));
        window.location.reload();
        return params;
    }
    // localStorage.removeItem(__tag);

    let loaded=JSON.parse(localStorage.getItem(__tag));
    if(!loaded) loaded=reset();
    // console.log(loaded);

    const [currentLeft, setCurrentLeft]=useState();
    const [currentRight, setCurrentRight]=useState();

    const [control, setControl]=useState(false);
    const [update, setUpdate]=useState(loaded);

    const refPos=useRef(loaded);
    const refLast=useRef();

 

    function getStlye(){
        return {left: refPos.current.x, 
            top:refPos.current.y,
            width: refPos.current.radius, 
            height: refPos.current.radius,
            transform:`rotate(${refPos.current.angle}deg)` };
        
    }
    

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
        <div className="bg-black absolute top-0 left-0 bottom-0 right-0">
            <div className="absolute flex flex-col py-[0.5rem] justify-between gap-[1.5rem] items-center">
                <img className="w-[37%]" src="/assets/scale_graphic.png"/>
                <div>
                    <div className="w-full flex-1 flex justify-center items-center">
                        <div className="h-full aspect-square bg-center bg-cover bg-no-repeat rounded-full"
                            style={{backgroundImage:`url(${currentLeft?.url})`}}>
                        </div>
                    </div>
                    <div>{currentLeft?.prompt}</div>
                </div>
                <img className="w-[46%]"  src="/assets/gradient_graphic.png"/>
            </div>
        </div>
        
    )
}
export default Compare;