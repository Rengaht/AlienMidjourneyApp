import { useEffect, useRef, useState } from 'react'
import '../App.css'
import axios from 'axios';
import { API_DALLE, API_UPLOAD, IDEL_TIMEOUT, STATUS, TITLE, TITLE_NL, TITLE_ZH } from '../constants';
import Manual from '../comps/manual';
import Album from '../comps/album';
import { fetchToBlob, saveRecords, selectFile, uploadCloudinary, uploadStorage } from '../utils';
import { gsap } from 'gsap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ManualNL from '../comps/manualNL';
import ManualZH from '../comps/manualZH';
import { useLongPress } from 'use-long-press';
import { isMobile } from 'react-device-detect';


const PRESSING_TIME=2000;

gsap.registerPlugin(TextPlugin);

// const tmp_prompt="a cyberpunk giant mont blanc dessert store on Mars, in western black-white comic style";
// const tmp_buttons=['V1','V1','V1','V1','V1','V1','V1','V1','V1'];

function Workshop() {

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
  const [pressing, setPressing]=useState();

  const [selectDot, setSelectDot]=useState('left');

  const refInput=useRef();
  const refRequest=useRef();
  const refDot=useRef();

  const refTimeout=useRef();
  const refAuto=useRef();
  const refAlbum=useRef();

  const bind = useLongPress(() => {
    console.log('Long pressed!');
    setPressing(()=>false);
    upload();

  },{
    onStart: ()=>{ setPressing(()=>true); console.log('long press start');},
    onFinish: ()=>{ setPressing(()=>false); console.log('long press finish')},
    onCancel: ()=>{ setPressing(()=>false); console.log('long press cancel')},
    threshold: PRESSING_TIME, 
    captureEvent: true,
  });
  
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

  const generate=()=>{
    
    let str=refInput.current.value;
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
      }else{
        setStatus(STATUS.IDLE);
      }

      // if(output.messageId){
      //   setStatus(val=>STATUS.PROCESSING_GENERATE);
      //   setMessageId(output.messageId);        
      // }  
    })
    .catch(function (error) {
      console.log(error)
      setStatus(STATUS.IDLE);
    });

  } 
  
  const getFileName=()=>{
    let str=refInput.current.value;
    // str=str.replace(/\n/g, " ");
    // return str.replace(/\s/g, '_');
    return str;
  }
  const upload=()=>{

    if(!imageSrc) return;

    setStatus(STATUS.UPLOADED);
    
    axios.post(API_UPLOAD,{
      data: {
        url:imageSrc,
        folder: "2025_MOCA_Workshop",
        name: getFileName(),
      }
    }).then(res=>{

        console.log(res.data);
        let url=res.data.secure_url || res.data.url;


        saveRecords(refInput.current.value, url, true).then(()=>{
            
            
            // selectFile({
            //     url: res,
            //     prompt: refInput.current.value,
            // });
            refAlbum.current.scrollTop=0;

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
    setPressing(false);
    refInput.current.value="";

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
    console.log('isMobile=', isMobile);
    // refInput.current.value=tmp_prompt;
    // setButtons(tmp_buttons);
    
    // upload();

  },[]);

  return (
    <div className="main">
        <button className="absolute top-[3rem] left-[2.88rem] cbutton" onClick={restart}>{lang=="en"? "restart":( lang=='zh'?'重新整理':"Herstarten")}</button>        
        
        <div className='absolute top-[3rem] right-[2.88rem] flex flex-row gap-[4px] font-bold text-[1rem]'>
          <div onClick={()=>navigate(`/workshop/${currentLang}${auto?`/${auto}`:''}`)} className={`${lang==currentLang? 'underline':''} cursor-pointer`}>{currentLang=='zh'? '中文': currentLang?.toUpperCase()}</div>
          /
          <div onClick={()=>navigate(`/workshop/en${auto?`/${auto}`:''}`, { state: {currentLang: lang}})} className={`${lang=='en'? 'underline':''} cursor-pointer`}>EN</div>
        </div>

        {!isMobile && (lang=='en' ? <Manual status={status}/>: (lang=='zh'? <ManualZH status={status}></ManualZH> : <ManualNL status={status}/>))}
        <div className='flex flex-col gap-[1rem] relative'>
        
            <section className='absolute w-full top-[-2rem] flex flex-row justify-center items-center gap-[1.5rem]'>
                <span className={`dot ${selectDot=='left'? 'selected':''}`} onClick={()=>setSelectDot('left')}></span>
                <span className={`dot ${selectDot=='right'? 'selected':''}`} onClick={()=>setSelectDot('right')}></span>
            </section>

          <div className='w-full flex-1 flex flex-col justify-center items-stretch gap-2 bg-back p-[0.6rem]'>
            <div className='w-full aspect-square flex justify-center items-center border-[1.5px] border-[rgba(255,255,255,0.6)]'>
              {!imageSrc? (
                <div className='w-full whitespace-nowrap flex justify-center text-[2rem] font-bold'>{lang=='en'? TITLE: (lang=='zh'? TITLE_ZH: TITLE_NL)}</div>
              ):(
                imageSrc.map((src, index)=><img key={index} src={src}/>)                          
              )}  
            </div>          
          </div>
          <div className='w-full bg-back flex flex-col justify-center items-center p-[0.6rem] gap-[0.75rem]'>
            <textarea disabled={status!=STATUS.IDLE} ref={refInput} className='w-full bg-transparent text-white font-bold text-[0.875rem] border-[rgba(255,255,255,0.6)]' 
                      placeholder={lang=='en'? 'enter prompt...': ( lang=='zh'? "輸入提示...":"Voer prompts in...")}
                      rows={5}/>
            { status==STATUS.UPLOAD?(
              <button id="_main_button" className={`${pressing? 'pressing':'bg-gray'} cbutton`}
                    {...bind()}>{getButtonText()}</button>
            ):(<button id="_main_button" className={`${(status==STATUS.IDLE || status==STATUS.UPLOAD)? 'bg-green':'bg-gray'} cbutton`}
                    disabled={status!=STATUS.IDLE && status!=STATUS.UPLOAD}
                    onClick={onSend}>{getButtonText()}</button>)}
          </div>
        </div>
        <Album ref={refAlbum} tmp={imageSrc} lang={lang}  
            workshop={true}
            selectDot={selectDot}
            onSelect={()=>{
                setAutorun(false);
                if(status==STATUS.IDLE) checkTimeout();
            }}/>
        <div className='footer'>
          Powered by DALL·E
        </div>
    </div>
  )
}

export default Workshop
