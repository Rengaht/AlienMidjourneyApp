import { useEffect, useState } from "react";
import { listFiles, selectFile, selectListener } from "../utils";

const Album=({tmp, ...props})=>{

    const [files, setFiles]=useState();
    const [select, setSelect]=useState();

    useEffect(()=>{
        listFiles().then(res=>{
            setFiles(res);
        })
    },[tmp]);

    useEffect(()=>{
        selectListener((data=>{
            setSelect(()=>data.url);
        }));
    },[]);

    return (
        <div className="side container">
            <h3 className="!self-start !text-left">Inner Aliens Archive</h3>
            <div className="flex-1 overflow-y-scroll overflow-x-hidden">
                <div className="grid grid-cols-3 gap-[0.5rem]">
                    {files?.map((file, i)=><img key={i} 
                                            className={`aspect-square cursor-pointer ${select==file? 'select':''}`}
                                            onClick={()=>{
                                                setSelect(file);
                                                selectFile(file);
                                            }} 
                                            src={file}/>)}                    
                </div>
            </div>        
        </div>
    )


}

export default Album;