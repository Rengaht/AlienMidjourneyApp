const Manual=({...props})=>{



    return (
        <div className="side relative px-[1rem] py-[0.8rem] overflow-scroll flex flex-col gap-[0.75rem]">
            {props.children}
            <div>
                <h3>How to make a prompt...</h3>
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

            <div className="pagination">
                <span className="!bg-gray"></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )


}

export default Manual;