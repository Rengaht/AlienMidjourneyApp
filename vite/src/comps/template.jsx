
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

export const ImageTemplate=({className, ...props})=>{
    return (
        <div className={`grid grid-cols-2 gap-[1.25rem] text-[4rem] font-bold template-image ${className || ''} aspect-square`}>
                {[...Array(4).keys()].map(k=> <span key={k}>{k+1}</span>)}
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

const Template=()=>{
    return (
        <div className="flex flex-col gap-[0.62rem]">
            <ImageTemplate />
            <div className="template-button flex flex-wrap flex-row gap-[0.75rem]">
                {[...Array(4).keys()].map(k=> <div key={k}></div>)}
                <div className="aspect-square !flex-none"></div>                
            </div>
            <div className="template-button flex flex-wrap flex-row gap-[0.75rem]">
                {[...Array(4).keys()].map(k=> <div key={k}></div>)}
                <div className="aspect-square !flex-none opacity-0"></div>
                {/* {[...Array(4).keys()].map(k=> <div key={k}></div>)} */}
            </div>
        </div>
    );

}

export default Template;