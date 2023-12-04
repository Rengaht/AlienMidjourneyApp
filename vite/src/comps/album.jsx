import { useEffect, useState } from "react";
import { listFiles } from "../utils";

const Album=({tmp, ...props})=>{

    const [files, setFiles]=useState();

    useEffect(()=>{
        listFiles().then(res=>{
            setFiles(res);
        })
    },[tmp])

    return (
        <div className="side container">
            <h3 className="!self-start !text-left">Inner Aliens Archive</h3>
            <div className="flex-1 overflow-scroll">
                <div className="grid grid-cols-3 gap-[0.5rem]">
                    {files?.map((file, i)=><img key={i} className="aspect-square" src={file}/>)}                    
                </div>
            </div>        
        </div>
    )


}

export default Album;