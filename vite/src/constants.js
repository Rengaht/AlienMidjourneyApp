export const API_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzA0MywiZW1haWwiOiJyZW5nYWgwQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoicmVuZ2FoMEBnbWFpbC5jb20iLCJpYXQiOjE3MDAyODAzNTF9.8Ws8LciwA-73Lo3klCQrfu5qdUK1EfJz_t87dDy3sY4";

export const API_IMAGINE="https://us-central1-alienmidjourneyapp.cloudfunctions.net/imagine";
export const API_MESSAGE="https://us-central1-alienmidjourneyapp.cloudfunctions.net/message";
export const API_VARIATION="https://us-central1-alienmidjourneyapp.cloudfunctions.net/buttons";

export const API_DALLE='https://us-central1-alienmidjourneyapp.cloudfunctions.net/dalle';
// export const API_DALLE='http://127.0.0.1:5001/alienmidjourneyapp/us-central1/dalle'
export const API_DALLE_VARIATION='https://us-central1-alienmidjourneyapp.cloudfunctions.net/dalleVariation';

export const API_UPLOAD='https://us-central1-alienmidjourneyapp.cloudfunctions.net/uploadImage';
// export const API_UPLOAD='http://127.0.0.1:5001/alienmidjourneyapp/us-central1/uploadImage';

export const STATUS={
    IDLE:'__idle',
    GENERATE:'__generate',    
    PROCESSING_GENERATE:'__processing_generate',
    BUTTONS:'__buttons',
    PROCESSING_BUTTONS:'__processing_buttons',
    UPLOAD:'__upload',
    UPLOADED:'__uploaded',
}


export const TITLE='Prompt Your Inner Aliens';
export const TITLE_NL='Prompt Je Inner Aliens';
export const TITLE_ZH='詠唱你的內在外星人';

export const CHECK_INTERVAL=6000;

export const BUCKET_URL='https://firebasestorage.googleapis.com/v0/b/';

export const IDEL_TIMEOUT=10000;



export const API_UPLOAD_AWS='https://us-central1-alienmidjourneyapp.cloudfunctions.net/uploadImageAWS';