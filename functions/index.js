const functions = require('firebase-functions');
// const admin = require('firebase-admin');
const axios= require('axios');
const FormData = require('form-data');
const busboy = require('busboy');
const { tmpdir } = require('os');
const { join } = require('path');
const { createReadStream, writeFileSync, read } = require('fs');
const { defineString } = require('firebase-functions/params');
const cloudinary = require('cloudinary').v2;
const { Blob } = require('buffer');

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

const CLOUDINARY_API_KEY='158212226222688';
const CLOUDINARY_API_SECRET='kwf1cLaFewvAuvJ8CqVl2P7R1Hc';
const API_UPLOAD_AWS='https://6ukum0hob0.execute-api.ap-northeast-1.amazonaws.com/dev/theinneralien2025/';


const headers={
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`,
    'ngrok-skip-browser-warning':true,
  };

cloudinary.config({ 
    cloud_name: 'fuyuanmuseum', 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET,
});


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
            if(!data) return res.status(400).send('No data');

            const config = {
                method: "post",
                url: `${DALLE_URL}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_KEY.value()}`,
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
                console.log(err.message);
                res.send(err);
            }
        });
    }
)

async function blobToBase64wo(blob) {
    // Convert Blob to Buffer
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    const dataUriPrefix = 'data:image/png;base64,';
    // Return as Data URI
    return `${dataUriPrefix}${base64}`;
}

async function toDataURL_node(url) {
    let response = await fetch(url);
    let blob = await response.blob();
    // let buffer = Buffer.from(await blob.arrayBuffer());
    // return "data:" + contentType + ';base64,' + buffer.toString('base64');

   return await blobToBase64(blob);

}

exports.uploadImage=functions.runWith(runtimeOpts).https.onRequest(
    async(req, res)=>{
        cors(req, res, async ()=>{     
            
            try{
             
                const data = req.body.data;
                console.log(data);
                if(!data) return res.status(400).send('No data');

                let img=data.url[0];

                // const file_response = await axios({
                //     url: data.url[0],
                //     method: 'GET',
                //     responseType: 'blob',
                // });
                // const file_response=await fetch(data.url[0]);
                // const blob=await file_response.arrayBuffer();
                // console.log(blob);
                // const href = URL.createObjectURL(file_response.data);
                // // const file_response=await fetch(data.url[0]);
                // console.log(file_response);

                // const reader = file_response.body.getReader();
                // console.log(reader);

                // let url='https://api.cloudinary.com/v1_1/fuyuanmuseum/image/upload';
                
                let url='https://upload.imagekit.io/api/v1/files/upload';

                
                // let file=await toDataURL_node(data.url[0]);
                // console.log(file);

                let formdata=new FormData();
                formdata.append('file', img);
                formdata.append('fileName', data.name);
                formdata.append('publicKey', 'public_1Msrt3eCXF+08wE0KTIXd/hi4bc=');
                formdata.append('folder', `${data.folder}/`);
                // formdata.append('customMetadata', `${JSON.stringify({prompt: data.name})}`);

                const config = {
                    method: "post",
                    url: url,
                    headers: {
                        ...formdata.getHeaders(),
                        Accept: 'application/json',
                        Authorization: 'Basic cHJpdmF0ZV9sL1N6bzRRSjNQUVlLTWRSVHNqL0RGdzQ4clk9Og==',
                    },
                    data: formdata
                };
                
                // console.log('send to dalle', config);

                const upload_res = await axios(config);


                // const upload_res=await cloudinary.uploader
                //     .upload(file, {
                //         resource_type: "image", 
                //         upload_preset: data.folder || 'inneralien',
                //         context: `alt=${data.name}`,
                //     });

                console.log('upload result', upload_res);
                // .then(result=>console.log(result));

                // let upload_res=await fetch(url, {
                //     method: 'POST',
                //     body: formdata,
                // });
                // console.log('Uploaded a blob or file!', upload_res.data);
                
                let res_data=upload_res.data;
                console.log('upload result', res_data);
                res.send(res_data);

            }catch(err){
                console.log(err.message, err);
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


exports.uploadS3=functions.runWith(runtimeOpts).https.onRequest(
    async(req, res)=>{
        cors(req, res, async ()=>{
            try{
                const data = req.body.data;
                console.log(data);
                if(!data) return res.status(400).send('No data');

                
                // let response = await fetch(data.url[0]);
                // const arrayBuffer = await response.arrayBuffer();  
                
                const axiosResponse = await axios({
                    url: data.url[0], //your url
                    method: "GET",
                    responseType: "arraybuffer",
                  });
                const arrayBuffer = axiosResponse.data;
                

                const headers=new Headers();
                headers.append('Content-Type', 'image/png');

                const requestOptions = {
                    method: 'PUT',
                    headers: headers,
                    body: arrayBuffer,
                };
                const upload_res=await fetch(`${API_UPLOAD_AWS}${data.folder}/${data.name}.png`, 
                    requestOptions);

                
                // let config = {
                //     method: 'put',
                //     maxBodyLength: Infinity,
                //     url: `${API_UPLOAD_AWS}${data.folder}/${data.name}.png`,
                //     headers: { 
                //       'Content-Type': 'image/png'
                //     },
                //     data : formdata
                // };
                // const upload_res = await axios(config);

                console.log('upload result', upload_res.data);
                
                res.send({
                    ...upload_res.data,
                    url: `${data.folder}/${data.name}.png`
                });

            }catch(err){
                console.log(err.message, err);
                res.send(err);
            }
        });
    }
)