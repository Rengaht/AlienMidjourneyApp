import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { downalodFiles, getRecords, listFiles, selectFile, selectListener } from "../utils";

const Album=forwardRef(({tmp,lang,onSelect, workshop, selectDot, ...props}, ref)=>{

    const [files, setFiles]=useState();
    const [select, setSelect]=useState();
    const [select_prompt, setSelectPrompt]=useState();

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
            setSelectPrompt(()=>data?.prompt);
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
        <div ref={ref} className="flex flex-col gap-[0.56rem] text-white">
            <div className="side container">
                <h3 className="!self-start !text-left">{lang=='en'? 'Inner Aliens Archive':(lang=='zh'?'內在外星人資料庫':'Inner Aliens Archief')}</h3>
                {/* <button onClick={downalodFiles}>downlaod</button> */}
                <div className="flex-1 relative ">
                    <div className="absolute w-full h-full overflow-y-scroll overflow-x-hidden">
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
            </div>
            <div className="side flex-none container h-1/5 flex flex-col">
                <h3 className="!self-start !text-left">{lang=='en'? 'Inner Alien Description':'內在外星人描述'}</h3>
                <div className="flex-1 border-white border px-[0.75rem] py-[0.69rem] text-[0.75rem]">{select_prompt||''}</div>
            </div>
            
        </div>
    )


});

export default Album;