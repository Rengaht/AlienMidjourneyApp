import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios';
import { API_DALLE, API_DALLE_VARIATION, API_IMAGINE, API_MESSAGE, API_TOKEN, API_VARIATION, BUCKET_URL, CHECK_INTERVAL, STATUS, TITLE } from './constants';
import Manual from './comps/manual';
import Album from './comps/album';
import Template, { ButtonTemplate } from './comps/template';
import { fetchToBlob, selectFile, uploadStorage } from './utils';
import { gsap } from 'gsap';

gsap.registerPlugin(TextPlugin);

// const tmp_prompt="a cyberpunk giant mont blanc dessert store on Mars, in western black-white comic style";
// const tmp_buttons=['V1','V1','V1','V1','V1','V1','V1','V1','V1'];

function DalleTest() {
  
  const [status, setStatus]=useState();
  const [messageId, setMessageId]=useState();
  const [imageSrc, setImageSrc]=useState();
  const [progress, setProgress]=useState();
  const [buttons, setButtons]=useState();

  const refInput=useRef();
  const refRequest=useRef();
  const refDot=useRef();

  const getButtonText=()=>{
    switch(status){
      case STATUS.IDLE:
        return 'Generate';
      case STATUS.UPLOAD:
        return 'upload';
      case STATUS.BUTTONS:
        return "Waiting...";
      case STATUS.PROCESSING_BUTTONS:
      case STATUS.PROCESSING_GENERATE:
      default:
        return "Processing...";
    }
  }
  
  const onSend=()=>{

    // variation("https://oaidalleapiprodscus.blob.core.windows.net/private/org-Ig4UjCpC9Ld18JnjgQnF4is0/user-rqcuQgFrHLZxrxZKBTjtlz6N/img-HyUdL4k0QAwa6QT8sA3Muk3Q.png?st=2024-05-01T01%3A23%3A25Z&se=2024-05-01T03%3A23%3A25Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-04-30T17%3A33%3A25Z&ske=2024-05-01T17%3A33%3A25Z&sks=b&skv=2021-08-06&sig=IQObeVDqtqr%2BGyJQGmNJPm7m9lZ95cbFO0JRE%2BZNoAM%3D");
    // return;

    switch(status){
      case STATUS.PROCESSING_BUTTONS:
      case STATUS.PROCESSING_GENERATE:
        return;
      case STATUS.IDLE:
        generate();
        break;
      case STATUS.UPLOAD:
        upload();
        break;

    }
  }

  const generate=()=>{
    
    let str=refInput.current.value;
    if(str.length<1) return;
    
    
    setStatus(STATUS.GENERATE);
    axios.post(API_DALLE, {
      data: {
        prompt:str,
        model: 'dall-e-2',
        n: 4,
        size:'256x256',
      },
    })
    .then(function (response) {
      let output=response.data;
      console.log(output);
      if(output.data?.length>0){
        setImageSrc(output.data.map(el=>el.url));
        setStatus(STATUS.BUTTONS);
      }

      // if(output.messageId){
      //   setStatus(val=>STATUS.PROCESSING_GENERATE);
      //   setMessageId(output.messageId);        
      // }  
    })
    .catch(function (error) {
      console.log(error)
    });

  } 
  const variation=(img)=>{
    return;
    
    fetchToBlob(img).then(blob=>{

      console.log(blob.size, blob.type);

      let formdata=new FormData();
    
      formdata.append('image', blob);
      // formdata.append('n',4);
      // formdata.append('size','1024x1024');

      setStatus(STATUS.GENERATE);
      axios({
        method:'post',
        url:API_DALLE_VARIATION, 
        data:formdata,
        headers:{
          'content-type': `multipart/form-data; boundary=${formdata._boundary}`,
        }
      })
      .then(function (response) {
        let output=response.data;
        console.log(output);
        if(output.data?.length>0){
          setImageSrc(output.data.map(el=>el.url));
          setStatus(STATUS.BUTTONS);
        }

      })
      .catch(function (error) {
        console.log(error)
      });

    });

  }

  const upscale=(img)=>{
    
    setImageSrc([img]);
    setStatus(STATUS.UPLOAD);

  }
  const getFileName=()=>{
    let str=refInput.current.value;
    str=str.replace(/\n/g, " ");
    return str.replace(/\s/g, '_');
  }
  const upload=()=>{

    if(!imageSrc) return;
    
    fetchToBlob(imageSrc).then(blob=>{

      if(!blob) return;
      console.log(blob.size, blob.type);

      uploadStorage(blob, getFileName()).then(res=>{
        console.log(res);
        selectFile(res);

        setTimeout(()=>{
          console.log('back to idle');
          // setStatus(val=>STATUS.IDLE);
          restart();
        },3000);
      });  
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
    if(refDot.current) refDot.current.kill();

    switch(status){
      case STATUS.PROCESSING_GENERATE:
      case STATUS.PROCESSING_BUTTONS:
          // default:
        checkStatus();

        // animation
        
        let dot=gsap.timeline({repeat:-1});
        let due=0.4;
        dot.to("#_main_button", {text:"processing", duration:due});
        dot.to("#_main_button", {text:"processing.", duration:due});
        dot.to("#_main_button", {text:"processing..", duration:due});
        dot.to("#_main_button", {text:"processing...", duration:due});
        dot.play();

        refDot.current=dot;
        break;
      
    }

    
   
  },[status, messageId]);
  useEffect(()=>{
    

    restart();
    // refInput.current.value=tmp_prompt;
    // setButtons(tmp_buttons);
    
    // upload();

  },[]);

  return (
    <div className="main">
        <button className="absolute top-[3rem] left-[2.88rem] cbutton" onClick={restart}>restart</button>        
        <Manual status={status}/>
        <div className='flex flex-col gap-[1rem] relative'>
          <h1 className='absolute top-[-4rem] w-full uppercase whitespace-nowrap flex justify-center'>{TITLE}</h1>
          <div className='w-full flex-1 flex flex-col justify-center items-stretch gap-2 bg-back p-[1.69rem]'>
            {/* <Template src={imageSrc} buttons={buttons} status={status}
                onClick={(key)=>{
                  if(status==STATUS.BUTTONS) onButton(key)
                }}/> */}
            <div>
              <div className='grid grid-cols-2'>
                {imageSrc?.map((src, index)=><img key={index} src={src}/>)}
              </div>
              { status==STATUS.BUTTONS && <>
                <div className='template-button flex flex-wrap flex-row gap-[0.75rem]'>
                  {['U1','U2','U3','U4'].map((el, index)=><div key={el} onClick={()=>upscale(imageSrc[index])}>{el}</div>)}
                </div>
                <div className='template-button flex flex-wrap flex-row gap-[0.75rem]'>
                  {['V1','V2','V3','V4'].map((el, index)=><div key={el} onClick={()=>variation(imageSrc[index])}>{el}</div>)}
                </div>
                </>}
            </div>
            {/* <div className='w-full aspect-square'>
              {imageSrc? <img src={imageSrc}></img>:<Template src={imageSrc}/>}
              
            </div>
            {status==STATUS.BUTTONS && buttons && <div className='grid grid-cols-5 gap-[1rem]'>
                {buttons.map((key, id)=>(<button className="vbutton row-span-1 !rounded-none" key={id} onClick={()=>onButton(key)}>{key}</button>))}
            </div>} */}
          </div>
          <div className='w-full bg-back flex flex-col justify-center items-center p-[0.6rem] gap-[0.75rem]'>
            <textarea disabled={status!=STATUS.IDLE} ref={refInput} className='w-full bg-transparent text-white font-bold text-[0.875rem]' placeholder='enter prompt...' rows={5}/>
            <button id="_main_button" className={`${(status==STATUS.IDLE || status==STATUS.UPLOAD)? 'bg-green':'bg-gray'} cbutton`}
                    disabled={status!=STATUS.IDLE && status!=STATUS.UPLOAD}
                    onClick={onSend}>{getButtonText()}</button>            
          </div>
        </div>
        <Album tmp={imageSrc}/>
        <div className='footer'>
          Powered by DALL·E
        </div>
    </div>
  )
}

export default DalleTest
