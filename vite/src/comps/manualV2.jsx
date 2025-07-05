
import { STATUS } from "../constants";
const __style="side container v2";


const getButtonColor=(status)=>{
    switch(status){
        case STATUS.IDLE:
        case STATUS.UPLOAD:
            return "bg-green";
        case STATUS.UPLOADED:
        case STATUS.PROCESSING_BUTTONS:
        case STATUS.PROCESSING_GENERATE:
        default:
            return "bg-gray";
    }
}

const getButtonText=(status, lang)=>{
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

export const ManualV2=({status, onSend})=>{
    
    const __h4_style="";
    const __input_style="flex-1";
    const __section_style="flex-1 text-[0.9375rem]";

    return (
        <div className={`${__style} en`}>
            <section>
                <h3 className="text-[1.25rem] tracking-[0.025rem] font-bold">How would you describe your inner alien?</h3>
                <p className="text-[0.6875rem] tracking-[0.015rem]">After listening to the guided meditation, please respond to the following questions and click the “Generate” button to create your inner alien.<br/>
                *If a question does not apply to your inner alien, you may leave it blank.
                </p>
            </section>

            <section className={__section_style}>
                <h4>1. What kind of shape and features does your inner alien have?</h4>
                <textarea id="_answer_1" placeholder="Enter your thoughts..." className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4>2. What color and texture does your inner alien have?</h4>
                <textarea id="_answer_2" placeholder="Enter your thoughts..." className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4>3. What kind of behavior or movement does your inner alien exhibit?</h4>
                <textarea id="_answer_3" placeholder="Enter your thoughts..."  className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4>4. How does your inner alien communicate with you?</h4>
                <textarea id="_answer_4" placeholder="Enter your thoughts..."  className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4>5. What kind of emotions or feelings does your inner alien have?</h4>
                <textarea id="_answer_5" placeholder="Enter your thoughts..."  className={__input_style}></textarea>
            </section>

            <button className={`cbutton self-center ${getButtonColor(status)}`} 
                    onClick={onSend}>{getButtonText(status, 'en')}</button>
        </div>
    )

}

export const ManualZHV2=({status, onSend})=>{

    const __h4_style="";
    const __input_style="flex-1";
    const __section_style="flex-1";

    return (
        <div className={__style}>
            <section>
                <h3 className="text-[1.25rem] tracking-[0.025rem] font-bold">你會如何描述你的內在外星人呢？</h3>
                <p className="text-[0.75rem] leading-[1.375rem] tracking-[0.015rem]">在聆聽冥想引導過後，回答以下相應的問題，並點選「開始生成」按鈕，生成你內心的外星人。<br/>
                *若有題目不適用於你的內在外星人的描述則無需填寫</p>
            </section>

            <section className={__section_style}>
                <h4 className={__h4_style}>1. 你的內在外星人擁有什麼樣的形體和特徵呢？</h4>
                <textarea id="_answer_1" placeholder="輸入你的想法..." className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4 className={__h4_style}>2. 你的內在外星人是什麼顏色和質地呢？</h4>
                <textarea id="_answer_2" placeholder="輸入你的想法..." className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4 className={__h4_style}>3. 你的內在外星人有什麼行為或是怎麼移動的呢</h4>
                <textarea id="_answer_3" placeholder="輸入你的想法..." className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4 className={__h4_style}>4. 你的內在外星人是如何與你溝通的呢？</h4>
                <textarea id="_answer_4" placeholder="輸入你的想法..." className={__input_style}></textarea>
            </section>

            <section className={__section_style}>
                <h4 className={__h4_style}>5. 你的內在外星人有什麼樣的情緒和感受呢？</h4>
                <textarea id="_answer_5" placeholder="輸入你的想法..." className={__input_style}></textarea>
            </section>

            <button className={`cbutton self-center ${getButtonColor(status)}`} 
                    onClick={onSend}>{getButtonText(status, 'zh')}</button>
        </div>
    )

}