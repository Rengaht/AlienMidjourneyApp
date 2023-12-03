import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios';
import { API_IMAGINE, API_MESSAGE, API_TOKEN, API_VARIATION, CHECK_INTERVAL, STATUS, TITLE } from './constants';
import Manual from './comps/manual';
import Album from './comps/album';
import Template from './comps/template';


const tmp_prompt="a cyberpunk giant mont blanc dessert store on Mars, in western black-white comic style";
// const tmp_buttons=['V1','V1','V1','V1','V1','V1','V1','V1','V1'];

function App() {
  
  const [status, setStatus]=useState();
  const [messageId, setMessageId]=useState();
  const [imageSrc, setImageSrc]=useState();
  const [progress, setProgress]=useState();
  const [buttons, setButtons]=useState();

  const refInput=useRef();
  const refRequest=useRef();

 
  const checkStatus=()=>{
    
    if(!messageId) return;
    // setStatus(STATUS.PROCESSING);

    axios({
      method:"GET",
      url: `${API_MESSAGE}?messageId=${messageId}`,      
    }).then(function (response) {
      let output=response.data;
      console.log(output);
      
      
      if(output.uri) setImageSrc(output.uri);
      if(output.progress) setProgress(output.progress);
      if(output.buttons) setButtons(output.buttons);

      if(!output.uri){
        
        if(refRequest.current) clearTimeout(refRequest.current);

        refRequest.current=setTimeout(()=>{
          checkStatus(messageId);
        },CHECK_INTERVAL); 

      }else{
        if(output.buttons.includes("U1")) setStatus(val=>STATUS.BUTTONS);
        else
          setStatus(val=>STATUS.UPLOAD);
      }
    })
    .catch(function (error) {
      console.log(error)
    });

  }
  const onSend=()=>{

    switch(status){
      case STATUS.PROCESSING_BUTTONS:
      case STATUS.PROCESSING_GENERATE:
        return;
      case STATUS.IDLE:
        generate();
        break;
      case STATUS.BUTTONS:
        upload();
        break;

    }
  }

  const generate=()=>{
    
    let str=refInput.current.value;
    if(str.length<1) return;
    
    
    setStatus(STATUS.GENERATE);
    axios.post(API_IMAGINE, {
      data: {
        prompt:str,
      },
    })
    .then(function (response) {
      let output=response.data;
      console.log(output);
      if(output.messageId){
        setStatus(val=>STATUS.PROCESSING_GENERATE);
        setMessageId(output.messageId);        
      }  
    })
    .catch(function (error) {
      console.log(error)
    });

  } 

  const upload=()=>{
    setStatus(STATUS.UPLOAD);
  }
  const onButton=(key)=>{

    setStatus(STATUS.BUTTONS);

    axios.post(API_VARIATION,{
      data:{
        messageId: messageId,
        button:key
      }
    }).then(function (response) {
      let output=response.data;
      console.log(output);

      if(output.messageId){
        setStatus(val=>STATUS.PROCESSING_BUTTONS);
        setMessageId(output.messageId);        
      }  
    })
    .catch(function (error) {
      console.log(error)
    });
  }
  const restart=()=>{
    setStatus(STATUS.IDLE);
    setButtons();
    setMessageId();
    setImageSrc();
    refInput.current.value="";
  }
  useEffect(()=>{
    
    console.log(status);
    switch(status){
      case STATUS.PROCESSING_GENERATE:
      case STATUS.PROCESSING_BUTTONS:
          checkStatus();
          break;
    }
  },[status, messageId]);
  useEffect(()=>{
    
    restart();
    // refInput.current.value=tmp_prompt;
    // setButtons(tmp_buttons);

  },[]);

  return (
    <div className="main">
        <Manual>
          <button className="absolute top-[-3rem] left-[1rem] vbutton" onClick={restart}>restart</button>        
        </Manual>
        <div className='flex flex-col gap-1 relative'>
          <h1 className='absolute top-[-4rem] w-full uppercase whitespace-nowrap flex justify-center'>{TITLE[status]}</h1>
          <div className='w-full flex-1 flex flex-col justify-center items-stretch gap-2 bg-back p-2'>
            <div className='w-full aspect-square'>
              <Template/>
              <img src={imageSrc}></img>          
            </div>
            {status==STATUS.BUTTONS && buttons && <div className='grid grid-cols-5 gap-[1rem]'>
                {buttons.map((key, id)=>(<button className="vbutton row-span-1" key={id} onClick={()=>onButton(key)}>{key}</button>))}
            </div>}
          </div>
          <div className='w-full bg-back flex flex-col justify-center items-center p-2 gap-2'>
            <textarea disabled={status!=STATUS.IDLE} ref={refInput} className='w-full bg-transparent text-white' placeholder='enter prompt...' rows={5}/>
            <button className={`${status==STATUS.IDLE? 'bg-slate-300':'bg-[#00FFC2]'} px-4 rounded-md uppercase`}
                    disabled={status!=STATUS.IDLE && status!=STATUS.BUTTONS}
                    onClick={onSend}>{ status==STATUS.IDLE ?'send': (status==STATUS.UPLOAD ?'upload':"...") }</button>
          </div>
        </div>
        <Album/>
    </div>
  )
}

export default App
