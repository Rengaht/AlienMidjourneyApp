import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { listFiles, selectFile, selectListener } from "../utils";

const Album=forwardRef(({tmp,lang,onSelect, ...props}, ref)=>{

    const [files, setFiles]=useState();
    const [select, setSelect]=useState();

    useEffect(()=>{
        listFiles().then(res=>{
            setFiles(res);
        })
    },[tmp, select]);
    
    useEffect(()=>{
        
        let p=document.getElementById(select);
        p?.scrollIntoView({
            behavior:'smooth',
            block:'nearest',
            inline:'nearest'
        });

    },[select]);

    useEffect(()=>{
        selectListener((data=>{
            setSelect(()=>data.url);
        }));
    },[]);

    useImperativeHandle(ref, ()=>({
        selectNext:()=>{
            if(!files) return;

            let index=files?.indexOf(select);
            let next_index=(index+1)%files.length;
            let next=files[next_index];
            console.log('current index', index, 'goto', next_index);
            setSelect(next);
            selectFile(next);
        }
    }));

    return (
        <div ref={ref} className="side container">
            <h3 className="!self-start !text-left">{lang=='en'? 'Inner Aliens Archive':'Inner Aliens Archief'}</h3>
            <div className="flex-1 overflow-y-scroll overflow-x-hidden">
                <div className="grid grid-cols-3 gap-[0.5rem]">
                    {files?.map((file, i)=><img key={i} 
                                            id={file}
                                            className={`aspect-square cursor-pointer ${select==file? 'select':''}`}
                                            onClick={()=>{
                                                setSelect(file);
                                                selectFile(file);
                                                onSelect();
                                            }} 
                                            src={file}/>)}                    
                </div>
            </div>        
        </div>
    )


});

export default Album;