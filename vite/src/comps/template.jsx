const Template=()=>{
    return (
        <div className="flex flex-col gap-[0.62rem]">
            <div className="grid grid-cols-2 gap-[1.25rem] text-[4rem] font-bold template-image">
                {[...Array(4).keys()].map(k=> <span key={k}>{k+1}</span>)}
            </div>
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