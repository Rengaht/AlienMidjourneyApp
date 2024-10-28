import { STATUS } from "../constants";
import { ButtonTemplate, ImageTemplate, Pagination } from "./template";


const __style="side container";
const ManualZH=({status, ...props})=>{
    
    // let status=STATUS.BUTTONS;

    if(status==STATUS.IDLE || status==STATUS.GENERATE || status==STATUS.PROCESSING_GENERATE)
        return (
            <div className={__style}>
                {props.children}
                <div>
                    <h3 className="!self-start !text-left">如何詠唱一個提示...</h3>
                    <p>提示(Prompt)是一段文字輸入，用來引導生成式 AI 生成所需的回應。</p>
                </div>
                <h2 className="mt-[1.5rem]">基礎提示</h2>            
                <div className="hint">
                    <label>文字提示</label>
                    <p>描述你對於內在外星人的想像...</p>                
                </div>
                <p>一個基本的提示可以是簡單的一個詞、一個詞組或是一段你所想看到的結果的簡短描述。</p>
                <div className="hint mt-[1.25rem]">
                    <label>提示建議</label>
                    <p>描述1、描述2、描述3、描述4</p>
                </div>
                <div className="mt-[1rem]">
                    詞彙的選擇很重要，可以使用逗號來分隔多個描述，具體或模糊的陳述都可以，而任何你不包括的內容將會以隨機狀態進行生成。你可以在內在外星人的描述中包括以下細節：
                    <ul>
                        <li>主題：人、動物、角色、物品、物件等。</li>
                        <li>媒介：照片、繪畫、插圖、雕塑、塗鴉、布幔等。</li>
                        <li>環境：室內、室外、月球、納尼亞、水下、綠野仙蹤等。</li>
                        <li>燈光：柔和、環境光、陰天、聚光燈等。</li>
                        <li>顏色：鮮豔、暗淡、明亮、單色、彩色、黑白、淡色等。</li>
                        <li>氣氛：沉靜、平和、喧鬧、充滿活力等。</li>
                        <li>構圖：肖像、特寫、俯視圖、鳥瞰圖等。</li>
                    </ul>
                </div>
                <h3 className="mt-[1rem]">按下「開始生成」按鈕，生成你內心的外星人，並耐心等待幾分鐘...</h3>
                
               <Pagination page={0} total={2}/>
            </div>
        );

    if(status==STATUS.UPLOAD|| status==STATUS.UPLOADED){
        return (
            <div className={`${__style} text-[1rem] items-center text-center !gap-[2rem]`}>
                <h3 className="!self-start !text-left">上傳你的內在外星人</h3>
                <p className="text-[1.25rem] font-bold mt-[0.5rem]">恭喜！</p>
                <p>你已成功將你的內在外星人視覺化。</p>

                <p>請按「上傳圖片」按鈕，<br/>將你的圖像上傳至螢幕頂部和檔案庫。</p>

                <p>你可以在右側的資料庫查看其他人的內在外星人。</p>

                <Pagination page={1} total={2}/>
            </div>
        );
    }

    return (
        <div className={`${__style} text-[1rem] items-center !gap-[1.5rem] text-center`}>
            <h3 className="!self-start !text-left">Upscale & Variations of your inner aliens</h3>
            <ImageTemplate className="w-[13.375rem] !gap-[0.5rem] !text-[2.5rem] mt-[1.25rem] mb-[1.25rem]"/>

            <ButtonTemplate className="w-[68%] mt-[0.25rem]" buttons={['U1','U2','U3','U4']}/>
            <p>Click the U button for the image you wish to upscale.</p>

            <ButtonTemplate className="w-[68%] mt-[0.25rem]" buttons={['V1','V2','V3','V4']}/>
            <p>Click the V button for the image you wish to create variations.</p>

            <p className="mt-[0.25rem] text-[1.25rem]">🔄</p>
            <p>Click the 🔄 button for regenerating a new image grid.</p>

            <h3 className="">After pressing a button, please wait patiently for another few minutes...</h3>
               
            <Pagination page={1} total={3}/>
        </div>
    )
}

export default ManualZH;