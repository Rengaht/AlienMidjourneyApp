import { useEffect, useRef, useState } from "react";
import { selectListener } from "../utils";
import { useControls, button, Leva } from 'leva'
import { useParams } from "react-router-dom";

const __tag="INNER_ALIEN_PARAMS_DISPLAY";
const Single=()=>{

    const { index }=useParams();

    function getSaveTag(){
        return `${__tag}_${index}`;
    }

    const reset=()=>{
        console.log('reset');
        localStorage.removeItem(getSaveTag());

        let w=window.innerWidth;
        let h=window.innerHeight;
        let r=Math.min(w, h);

        let params={
            x: w/2-r/2,
            y: h/2-r/2,
            radius: r,
            angle: 0,
        };
        localStorage.setItem(getSaveTag(), JSON.stringify(params));
        window.location.reload();
        return params;
    }
    // localStorage.removeItem(__tag);

    let loaded=JSON.parse(localStorage.getItem(getSaveTag()));
    if(!loaded) loaded=reset();
    // console.log(loaded);

    const [current, setCurrent]=useState();
    const [control, setControl]=useState(false);
    const [update, setUpdate]=useState(loaded);

    const refPos=useRef(loaded);
    const refLast=useRef();

    const { radius, x, y, angle } = useControls({
        radius: {
            value: loaded.radius, 
            onChange: (v)=>{ refPos.current.radius=v; setUpdate(new Date());},
        },
        x:{
            value: loaded.x , 
            onChange: (v)=>{ refPos.current.x=v; setUpdate(new Date());},
        },
        y:{
            value: loaded.y,
            onChange: (v)=>{ refPos.current.y=v; setUpdate(new Date());},
        },
        angle:{
            value: loaded.angle,
            onChange: (v)=>{ refPos.current.angle=v; setUpdate(new Date());},
        },
        save: button(()=>{
            console.log(refPos.current);
            localStorage.setItem(getSaveTag(), JSON.stringify({
                x: refPos.current.x,
                y: refPos.current.y,
                radius: refPos.current.radius,
                angle: refPos.current.angle,
            }));
        }),
        reset: button(reset),
    });

    function getStlye(){
        return {left: refPos.current.x, 
            top:refPos.current.y,
            width: refPos.current.radius, 
            height: refPos.current.radius,
            transform:`rotate(${refPos.current.angle}deg)` };
        
    }
    

    useEffect(()=>{
        
        selectListener((data)=>{
            setCurrent(()=>data);
        }, index);

        document.addEventListener('keydown', function(event){
            // event.preventDefault();
            console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
            if(event.key=='q' || event.key=='Q'){
               let now=new Date();
               if(now-refLast.current<100) return;
               setControl(val=>!val);    
               refLast.current=now;         
            }
        }, false);

    },[]);

    useEffect(()=>{
        console.log(refPos.current);
    },[refPos]);
    useEffect(()=>{
        console.log(control);
    },[control]);

    return (
        <div className="bg-black absolute top-0 left-0 bottom-0 right-0">
            <div className="fixed flex flex-col py-[0.5rem] justify-between gap-[1.5rem] items-center" style={getStlye()}>
                <img className="w-[37vh]" src="/assets/scale_graphic.png"/>
                <div className="w-full flex-1 flex justify-center items-center">
                    <div className="h-full aspect-square bg-center bg-cover bg-no-repeat rounded-full"
                        style={{backgroundImage:`url(${current?.url})`}}>
                    {/* <img src={current?.url} className="rounded-full max-w-full" 
                    update={update}/> */}
                    </div>
                </div>
                <div>{current?.prompt}</div>
                <img className="w-[46vh]"  src="/assets/gradient_graphic.png"/>
            </div>
            <Leva hidden={!control}/>
        </div>
        
    )
}
export default Single;