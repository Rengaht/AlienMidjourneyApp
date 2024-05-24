import { STATUS } from "../constants";
import { ButtonTemplate, ImageTemplate, Pagination } from "./template";


const __style="side container";
const ManualNL=({status, ...props})=>{
    
    // let status=STATUS.BUTTONS;

    if(status==STATUS.IDLE || status==STATUS.GENERATE || status==STATUS.PROCESSING_GENERATE)
        return (
            <div className={__style}>
                {props.children}
                <div>
                    <h3 className="!self-start !text-left">Hoe maak je een prompt...</h3>
                    <p>Een prompt is een tekstinvoer die de generatieve AI instrueert om de gewenste respons te genereren</p>
                </div>
                <h2 className="mt-[1.5rem]">Basic Prompts</h2>            
                <div className="hint">
                    <label>Tekstprompt</label>
                    <p>Beschrijving van je innerlijke verbeelding van je aliens...</p>                
                </div>
                <p>Een basisprompt kan een enkel woord, een zin of een aantal korte zinnen zijn die beschrijven wat je wilt zien.</p>
                <div className="hint mt-[1.25rem]">
                    <label>Prompt Tips</label>
                    <p>Beschrijving 1, Beschrijving 2, Beschrijving 3, Beschrijving 4</p>
                </div>
                <div className="mt-[1rem]">
                    Plaats komma’s tussen je beschrijvingen. Woordkeuze is belangrijk. Wees zo specifiek of vaag als je wilt, alles wat je weglaat wordt gerandomiseerd. Details die je zou kunnen opnemen in de beschrijving van je innerlijke aliens:
                    <ul>
                        <li>Onderwerp: persoon, dier, personage, locatie, object, etc.</li>
                        <li>Medium: foto, schilderij, illustratie, sculptuur, krabbel, wandtapijt, etc.</li>
                        <li>Omgeving: binnen, buiten, op de maan, in Narnia, onder water, de Smaragden Stad, etc.</li>
                        <li>Verlichting: zacht, sfeervol, bewolkt, neon, studiolampen, etc.</li>
                        <li>Kleur: levendig, gedempt, helder, monochromatisch, kleurrijk, zwart-wit, pastel, etc.</li>
                        <li>Stemming: kalm, uitbundig, energiek, etc.</li>
                        <li>Compositie: portret, headshot, close-up, vogelperspectief, etc.</li>
                    </ul>
                </div>
                <h3 className="mt-[1rem]">Druk op de knop ‘Genereren’ om je inner aliens te genereren en wacht  een paar seconden...</h3>
                
               <Pagination page={0} total={2}/>
            </div>
        );

    if(status==STATUS.UPLOAD){
        return (
            <div className={`${__style} text-[1rem] items-center text-center !gap-[2rem]`}>
                <h3 className="!self-start !text-left">Upload je inner aliens</h3>
                <p className="text-[1.25rem] font-bold mt-[0.5rem]">Gefeliciteerd!</p>
                <p>Je hebt je inner aliens gevisualiseerd.</p>

                <p>Druk op de knop ‘Uploaden’ om je afbeelding naar het bovenste scherm en het archief te uploaden.</p>

                <p>Je kunt de innerlijke aliens van anderen bekijken in het innerlijke aliens-archief aan de rechterkant.</p>

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

export default ManualNL;