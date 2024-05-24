const functions = require('firebase-functions');
// const admin = require('firebase-admin');
const axios= require('axios');
const FormData = require('form-data');
const busboy = require('busboy');
const { tmpdir } = require('os');
const { join } = require('path');
const { createReadStream, writeFileSync } = require('fs');
const { defineString } = require('firebase-functions/params');


// admin.initializeApp();

const cors = require('cors')({origin: true});


const runtimeOpts = {
    timeoutSeconds: 60,
    // memory: '1GB',
    maxInstances: 10,
}

const IMAGEIN_URL='https://api.mymidjourney.ai/api/v1/midjourney/imagine';
const MESSAGE_URL='https://api.mymidjourney.ai/api/v1/midjourney/message/';
const BUTTON_URL='https://api.mymidjourney.ai/api/v1/midjourney/button';
const API_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzA0MywiZW1haWwiOiJyZW5nYWgwQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicmVuZ2FoMEBnbWFpbC5jb20iLCJpYXQiOjE3MDAyODAzNTF9.8Ws8LciwA-73Lo3klCQrfu5qdUK1EfJz_t87dDy3sY4';

const DALLE_URL='https://api.openai.com/v1/images/generations';
const DALLE_VARIATION_URL='https://api.openai.com/v1/images/variations';
const OPENAI_KEY=defineString('OPENAI_KEY');


const headers={
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`,
    'ngrok-skip-browser-warning':true,
  };


exports.imagine = functions.runWith(runtimeOpts).https.onRequest(
    async (req, res) => {
        cors(req, res, async ()=>{
            const data = req.body.data;
            console.log(req.body);

            const config = {
                method: "post",
                url: IMAGEIN_URL,
                headers: headers,
                data: data,
            };

            console.log(config);

            const response = await axios(config);
            let output=response.data;
            console.log(output);

            res.send(output);
        });
});

exports.message =  functions.runWith(runtimeOpts).https.onRequest(
    async (req, res) => {
        cors(req, res, async ()=>{
            const messageId = req.query.messageId;

            const config = {
                method: "get",
                url: `${MESSAGE_URL}${messageId}`,
                headers: headers
            };

            const response = await axios(config);
            let output=response.data;
            console.log(output);

            res.send(output);
        });
})

exports.buttons =  functions.runWith(runtimeOpts).https.onRequest(
    async (req, res) => {
        cors(req, res, async ()=>{
            const data = req.body.data;
            console.log(req.body);
            
            const config = {
                method: "post",
                url: `${BUTTON_URL}`,
                headers: headers,
                data: data
            };

            const response = await axios(config);
            let output=response.data;
            console.log(output);

            res.send(output);
        });
})


exports.dalle=functions.runWith(runtimeOpts).https.onRequest(
    async(req, res)=>{
        cors(req, res, async ()=>{     

            
            const data = req.body.data;
            console.log(data);

            const config = {
                method: "post",
                url: `${DALLE_URL}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_KEY}`,
                },
                data: {
                    "model": data.model || "dall-e-3",
                    "prompt": data.prompt,
                    "n": data.n || 1,
                    "size": data.size ||"1024x1024",
                    "style": data.style|| 'natural',
                }
            };
            console.log(config);

            try{
                const response = await axios(config);
                let output=response.data;
                console.log(output);
                
                res.send(output);

            }catch(err){
                console.log(err);
                res.send(err);
            }
        });
    }
)


exports.dalleVariation=functions.runWith(runtimeOpts).https.onRequest(
    async(req, res)=>{
        cors(req, res, async ()=>{
            
            // console.log(req.body);
                
            // Ensure you have the image as part of the form data
            // if (!req.files || !req.files.image) {
            //     res.status(400).send('No image file uploaded.');
            //     return;
            // }

            const bb = busboy({ headers: req.headers });

            const tmpdirPath = tmpdir();
            let fileData = {};
        
            bb.on('file', (name, file, info) => {
              const { filename, encoding, mimeType } = info;
              
              console.log(
                `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
                filename,
                encoding,
                mimeType
              );
              

                const filepath = join(tmpdirPath, name);
                console.log('create tmp file', filepath);

                const writeStream = createReadStream(filepath);
            
                writeStream.on('open', () => {
                    file.pipe(writeStream);
                });

            //   file.on('data', (data) => {
            //     console.log(`File [${filename}] got ${data.length} bytes`);                
                
            //   }).on('close', async () => {
            //     console.log(`File [${filename}] done`);
            //   });
              
                file.on('end', () => {
                    console.log(`File [${name}] end`);
                    fileData = { filepath, mimeType };
                });
            });
            bb.on('finish',async ()=>{
                try {
                    const { filepath, mimetype } = fileData;
                    console.log('load from ', filepath, mimetype);
                    
                    const formData = new FormData();
                    formData.append('image', createReadStream(filepath), {
                        contentType: mimetype,
                    });
                    formData.append('n',4);
                    formData.append('size','1024x1024');
    
                    
                    const config = {
                        method: "post",
                        url: `${DALLE_VARIATION_URL}`,
                        headers: {
                            ...formData.getHeaders(),
                            "Authorization": `Bearer ${OPENAI_KEY}`,
                        },
                        data: formData
                    };
                    
                    // console.log('send to dalle', config);
    
                    const response = await axios(config);
                    let output=response.data;
                    console.log(output);
                    
                    res.send(output);

                } catch (error) {
                    console.error('Failed to send file:', error);
                    res.status(500).send('Failed to send file');
                }
            })


            try{
                // req.pipe(bb);
                bb.end(req.body);
        
            }catch(err){
                console.log(err);
                res.send(err);
            }
        });
    }
)