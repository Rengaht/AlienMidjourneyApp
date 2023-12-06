import { STATUS } from "../constants";

export const Pagination=({page, total, ...props})=>{
    return (
        <div className="pagination flex-1 items-end">
            {[...Array(total).keys()].map(k=>{
                if(k==page) return <span key={k} className="!bg-gray"></span>;
                return <span key={k}/>;
            })}
        </div>
    );
}

export const ImageTemplate=({className, src,  ...props})=>{

    function getPosition(i){
        switch(i){
            case 0: return { backgroundPosition: 'left top'};
            case 1: return { backgroundPosition: 'right top'};
            case 2: return { backgroundPosition: 'left bottom'};
            case 3: return { backgroundPosition: 'right bottom'};
        }
    }
    return (
        <div className={`grid grid-cols-2 gap-[1.25rem] text-[4rem] font-bold template-image ${className || ''} aspect-square`}>
                {[...Array(4).keys()].map(k=>{
                    if(src) return (
                        <span key={k} style={{backgroundImage: `url(${src})`, backgroundSize:"200% 200%", ...getPosition(k)}}/>
                    );
                    return (<span key={k}>{k+1}</span>)
                })}
        </div>
    );
}
export const ButtonTemplate=({buttons, className, ...props})=>{
    return (
        <div className={`flex flex-wrap flex-row gap-[0.75rem] text-[0.875rem] ${className}`}>
            {buttons.map(k=> <div className="flex-1 flex justify-center items-center text-black font-bold !bg-gray" key={k}>{k}</div>)}
        </div>
    );
}

const Template=({src, buttons, status, onClick, ...props})=>{
    return (
        <div className="flex flex-col gap-[0.62rem]">
            {status==STATUS.UPLOAD? <img className="w-full aspect-square" src={src}/> :<ImageTemplate src={src}/>}
            <div className="template-button flex flex-wrap flex-row gap-[0.75rem]">
                {[...Array(4).keys()].map(k=>{
                    if(status==STATUS.BUTTONS) return <div key={k} className="vbutton" onClick={()=>onClick(buttons[k])}>{buttons[k]}</div>;
                    return <div key={k}></div>;
                })}
                {status==STATUS.BUTTONS?(
                    <div className={`aspect-square !flex-none vbutton`} onClick={()=>onClick(buttons[4])}>
                        {buttons[4]}
                    </div>):(
                        <div className={`aspect-square !flex-none`}></div>
                )}                
            </div>
            <div className="template-button flex flex-wrap flex-row gap-[0.75rem]">
                {[...Array(4).keys()].map(k=>{
                    if(status==STATUS.BUTTONS) return (<div key={k} className="vbutton" onClick={()=>onClick(buttons[k+5])}>{buttons[k+5]}</div>);
                    return <div key={k}></div>;
                })}
                <div className="aspect-square !flex-none opacity-0"></div>
                {/* {[...Array(4).keys()].map(k=> <div key={k}></div>)} */}
            </div>
        </div>
    );

}

export default Template;