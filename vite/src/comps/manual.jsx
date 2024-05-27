import { STATUS } from "../constants";
import { ButtonTemplate, ImageTemplate, Pagination } from "./template";


const __style="side container";
const Manual=({status, ...props})=>{
    
    // let status=STATUS.BUTTONS;

    if(status==STATUS.IDLE || status==STATUS.GENERATE || status==STATUS.PROCESSING_GENERATE)
        return (
            <div className={__style}>
                {props.children}
                <div>
                    <h3 className="!self-start !text-left">How to make a prompt...</h3>
                    <p>A Prompt is a text input  that instructs the Generative AI to generate the desired response</p>
                </div>
                <h2 className="mt-[1.5rem]">Basic Prompts</h2>            
                <div className="hint">
                    <label>Text Prompt</label>
                    <p>Description of your imagination of your aliens...</p>                
                </div>
                <p>A basic prompt can be as simple as a single word, phrase, or  short sentences that describe what you want to see.</p>
                <div className="hint mt-[1.25rem]">
                    <label>Prompt Tips</label>
                    <p>Description 1, Description 2, Description 3, Description 4</p>
                </div>
                <div className="mt-[1rem]">
                    Divide your descriptions with commas. Word choice matters. Be as specific or vague as you want, anything you leave out will be randomized. Details you could include in the description of your inner aliens:
                    <ul>
                        <li>Subject: person, animal, character, location, object, etc.</li>
                        <li>Medium: photo, painting, illustration, sculpture, doodle, tapestry, etc.</li>
                        <li>Environment: indoors, outdoors, on the moon, in Narnia, underwater, the Emerald City, etc.</li>
                        <li>Lighting: soft, ambient, overcast, neon, studio lights, etc</li>
                        <li>Color: vibrant, muted, bright, monochromatic, colorful, black and white, pastel, etc.</li>
                        <li>Mood: Sedate, calm, raucous, energetic, etc.</li>
                        <li>Composition: Portrait, headshot, closeup, birds-eye view, etc.</li>
                    </ul>
                </div>
                <h3 className="mt-[1rem]">Press the ‘Generate’ button to start generating your inner aliens and wait patiently for a few minutes...</h3>
                
               <Pagination page={0} total={2}/>
            </div>
        );

    if(status==STATUS.UPLOAD || status==STATUS.UPLOADED){
        return (
            <div className={`${__style} text-[1rem] items-center text-center !gap-[2rem]`}>
                <h3 className="!self-start !text-left">Upload your inner aliens</h3>
                <p className="text-[1.25rem] font-bold mt-[0.5rem]">Congratulations!</p>
                <p>You have successfully visualized your inner aliens.</p>

                <p>Please press the ‘Upload’ button to upload your image to the upper screen and the archive.</p>

                <p>You can check out others’ aliens in the inner aliens archive on the right side.</p>

                <Pagination page={2} total={3}/>
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

export default Manual;