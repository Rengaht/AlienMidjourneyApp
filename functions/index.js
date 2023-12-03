const functions = require('firebase-functions');
// const admin = require('firebase-admin');
const axios= require('axios');
// admin.initializeApp();

const cors = require('cors')({origin: true});



const IMAGEIN_URL='https://api.mymidjourney.ai/api/v1/midjourney/imagine';
const MESSAGE_URL='https://api.mymidjourney.ai/api/v1/midjourney/message/';
const BUTTON_URL='https://api.mymidjourney.ai/api/v1/midjourney/button';
const API_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzA0MywiZW1haWwiOiJyZW5nYWgwQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicmVuZ2FoMEBnbWFpbC5jb20iLCJpYXQiOjE3MDAyODAzNTF9.8Ws8LciwA-73Lo3klCQrfu5qdUK1EfJz_t87dDy3sY4';

const headers={
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`,
    'ngrok-skip-browser-warning':true,
  };


exports.imagine = functions.https.onRequest(
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

exports.message = functions.https.onRequest(
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

exports.buttons = functions.https.onRequest(
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
