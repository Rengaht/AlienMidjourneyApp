import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios';
import { API_DALLE, API_UPLOAD, API_UPLOAD_AWS, FOLDER_MOCA, IDEL_TIMEOUT, STATUS, TITLE, TITLE_NL, TITLE_ZH, URL_AWS_BUCKET } from './constants';
import Manual from './comps/manual';
import Album from './comps/albumV2';
import Template, { ButtonTemplate } from './comps/template';
import { fetchToBlob, selectFile, uploadCloudinary, saveRecords } from './utils';
import { gsap } from 'gsap';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import { ManualV2, ManualZHV2 } from './comps/manualV2';

gsap.registerPlugin(TextPlugin);

// const tmp_prompt="a cyberpunk giant mont blanc dessert store on Mars, in western black-white comic style";
// const tmp_buttons=['V1','V1','V1','V1','V1','V1','V1','V1','V1'];

function DalleV2() {
  
  const {lang, auto}=useParams();
  const navigate=useNavigate();
  const location=useLocation();
  const currentLang=location.state?.currentLang || lang;
  // console.log(currentLang, lang);

  const [status, setStatus]=useState();
  const [messageId, setMessageId]=useState();
  const [imageSrc, setImageSrc]=useState();
  const [progress, setProgress]=useState();
  const [buttons, setButtons]=useState();
  const [autorun, setAutorun]=useState();


  const refRequest=useRef();
  const refDot=useRef();

  const refTimeout=useRef();
  const refAuto=useRef();
  const refAlbum=useRef();
  
  const checkTimeout=()=>{
    
    if(auto!='auto') return;

    if(refTimeout.current) clearTimeout(refTimeout.current);
    refTimeout.current=setTimeout(()=>{
      // go auto
      setAutorun(true);
      console.log('>>>>   auto run  >>>>');      
      
    }, IDEL_TIMEOUT);
  }
  function checkNext(){
    
    if(auto!='auto') return;

    if(!refAuto.current) clearTimeout(refAuto.current);
    refAuto.current=setTimeout(()=>{        
      refAlbum.current?.selectNext();
      checkNext();
    
    }, IDEL_TIMEOUT);
    
  }
  useEffect(()=>{

    if(auto!='auto') return;
    
    if(autorun){
      checkNext();
    }else{
      console.log('>>>>  stop auto run  >>>>');            
      clearTimeout(refAuto.current);
    }

  },[autorun]);

  const getButtonText=()=>{
    switch(status){
      case STATUS.IDLE:
        if(lang=="nl") return "Genereren";
        if(lang=='zh') return "開始生成";
        return "Generate";
      case STATUS.UPLOAD:
        if(lang=='nl') return 'Uploaden';
        else if(lang=='zh') return '上傳圖片';
        return 'upload';
      case STATUS.UPLOADED:
        if(lang=='nl') return 'Geüpload';
        else if(lang=='zh') return '成功上傳';
        return 'uploaded';
      case STATUS.BUTTONS:
        return "Waiting...";
      case STATUS.PROCESSING_BUTTONS:
      case STATUS.PROCESSING_GENERATE:
      default:
        if(lang=='nl') return <span className='loading'>Verwerking</span>;
        else if(lang=='zh') return <span className='loading'>生成中</span>;
        return <span className='loading'>Processing</span>
    }
  }
  
  const onSend=()=>{
    
    setAutorun(false);
    
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
  const getPrompt=()=>{
    let str='';
    for(var i=0;i<5;++i){
      let el=document.querySelector(`#_answer_${i+1}`);
      if(el && el.value){
        str+=el.value+';';
      }
    }
    return str;
  }
  
  const generate=()=>{
    
    // let str=refInput.current.value;
    let str=getPrompt();


    if(str.length<1) return;
    
    
    setStatus(STATUS.GENERATE);
    axios.post(API_DALLE, {
      data: {
        prompt:str,
        model: 'dall-e-3',
        n: 1,
        size:'1024x1024',
        style:'vivid',
      },
    })
    .then(function (response) {
      let output=response.data;
      console.log(output);
      if(output.data?.length>0){
        setImageSrc(output.data.map(el=>el.url));
        // setStatus(STATUS.BUTTONS);
        setStatus(STATUS.UPLOAD);
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
  
  const getFileName=()=>{
    // let str=refInput.current.value;
    let str=getPrompt();
    str=str.replaceAll(';', '__');

    str=str.replace(/\n/g, " ");
    return str.replace(/\s/g, '_');
  }
  const upload=()=>{

    if(!imageSrc) return;

    setStatus(STATUS.UPLOADED);

  

    // axios.post(API_AWS_UPLOAD, {
    axios.post(API_UPLOAD, {
      data:{
        url: imageSrc,
        folder: FOLDER_MOCA,
        name: getFileName(),
      }
    })
      .then(res=>{
    
        console.log(res.data);
        let url=res.data.secure_url || res.data.url;
        // let url=`${URL_AWS_BUCKET}${FOLDER_MOCA}/${getFileName()}.png`;
        
        let prompt=getPrompt();

        saveRecords(prompt, url).then(()=>{
            
          console.log(res);
          selectFile({
              url: url,
              prompt: prompt,
          });
          refAlbum.current.scrollTop=0;

          setTimeout(()=>{
            console.log('back to idle');
            // setStatus(val=>STATUS.IDLE);
            restart();
          },3000);

        });
    }).catch(err=>{
      console.log(err);
    });

    
  }
  const clearInput=()=>{
    for(var i=0;i<5;++i){
      let el=document.querySelector(`#_answer_${i+1}`);
      if(el) el.value='';
    }
  }

  const restart=()=>{
    setStatus(STATUS.IDLE);
    setButtons();
    setMessageId();
    setImageSrc();
    // refInput.current.value="";

    clearInput();


    checkTimeout();
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
    
    setAutorun(false);
    
   
  },[status, messageId]);
  
  useEffect(()=>{
    

    restart();
    // refInput.current.value=tmp_prompt;
    // setButtons(tmp_buttons);
    
    // upload();

  },[]);

  return (
    <div className="main v2">
        <button className="absolute top-[3rem] left-[1.87rem] cbutton" onClick={restart}>{lang=="en"? "restart":( lang=='zh'?'重新整理':"Herstarten")}</button>        
        
        <div className='absolute top-[3rem] right-[1.87rem] flex flex-row gap-[4px] font-bold text-[1rem]'>
        <div onClick={()=>navigate(`/v2/zh${auto?`/${auto}`:''}`)} 
            className={`${lang=='zh'? 'underline':''} cursor-pointer`}>中文</div>
          /
          <div onClick={()=>navigate(`/v2/en${auto?`/${auto}`:''}`, { state: {currentLang: lang}})} 
              className={`${lang=='en'? 'underline':''} cursor-pointer`}>EN</div>
        </div>

        {lang=='zh' ? <ManualZHV2 status={status} onSend={onSend}/>
          : <ManualV2 status={status} onSend={onSend}></ManualV2>}

        <div className='flex flex-col gap-[1rem] justify-center items-center relative'>
          <div className='flex-1'></div>
          <div className='w-full flex flex-col justify-center items-center gap-2 bg-back p-[0.6rem]'>
            <div className='w-full aspect-square flex justify-center items-center border-[1.5px] border-white'>
              {!imageSrc? (
                <div className={`w-full whitespace-nowrap flex justify-center text-[1.625rem] font-bold text-white ${lang=='zh'&& 'tracking-[0.40625rem]'}`}>{lang=='en'? TITLE: (lang=='zh'?TITLE_ZH: TITLE_NL)}</div>
              ):(
                imageSrc.map((src, index)=><img key={index} src={src}/>)                          
              )}  
            </div>          
          </div>
          <div className='flex-1 relative w-full'>
            <div className='footer v2 text-white'>
              Powered by DALL·E
            </div>
          </div>
        </div>
        <Album ref={refAlbum} tmp={imageSrc} lang={lang}  
          onSelect={()=>{
            setAutorun(false);
            if(status==STATUS.IDLE) checkTimeout();
          }}/>
        
    </div>
  )
}

export default DalleV2
