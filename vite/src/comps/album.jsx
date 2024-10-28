import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { downalodFiles, getRecords, listFiles, selectFile, selectListener } from "../utils";

const Album=forwardRef(({tmp,lang,onSelect, workshop, selectDot, ...props}, ref)=>{

    const [files, setFiles]=useState();
    const [select, setSelect]=useState();

    useEffect(()=>{
        // listFiles().then(res=>{
        //     setFiles(res);
        // })
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

        getRecords((data)=>{
            console.log('getRecords', data);
            setFiles(()=>data);
        }, workshop);
       
        selectListener((data=>{
            setSelect(()=>data?.url);
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
            <h3 className="!self-start !text-left">{lang=='en'? 'Inner Aliens Archive':(lang=='zh'?'內在外星人資料庫':'Inner Aliens Archief')}</h3>
            {/* <button onClick={downalodFiles}>downlaod</button> */}
            <div className="flex-1 overflow-y-scroll overflow-x-hidden">
                <div className="grid grid-cols-3 gap-[0.5rem]">
                    {files?.map(({prompt, url}, i)=><img key={i} 
                                            id={i}
                                            className={`aspect-square cursor-pointer ${select==url? 'select':''}`}
                                            onClick={()=>{
                                                setSelect(url);
                                                
                                                if(workshop){
                                                    selectFile({
                                                        url: url,
                                                        prompt: prompt
                                                    }, selectDot);
                                                }else{
                                                    selectFile({
                                                        url: url,
                                                        prompt: prompt
                                                    });
                                                }
                                                onSelect();
                                            }} 
                                            src={url}/>)}                    
                </div>
            </div>        
        </div>
    )


});

export default Album;