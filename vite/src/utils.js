import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL} from "firebase/storage";
import Moment from "moment";

const firebaseConfig = {
    apiKey: "AIzaSyBHyYTbsVoX-7mFXvnlB8ck6YHJIAiIy5A",
    authDomain: "alienmidjourneyapp.firebaseapp.com",
    projectId: "alienmidjourneyapp",
    storageBucket: "alienmidjourneyapp.appspot.com",
    messagingSenderId: "26773746518",
    appId: "1:26773746518:web:fb673f825b3a6f7e741cf7",
    measurementId: "G-4QGS9ZDNWW"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);



async function uploadStorage(file, name){

    let timestr=Moment().format( "YYYYMMDDhhmm" );
    const storageRef = ref(storage, `${timestr}__${name}.png`);
    let snapshot=await uploadBytes(storageRef, file);
    console.log('Uploaded a blob or file!', snapshot.dataURItoBlob);
    return 'ok';
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

async function fetchToBlob(url){
    let res=await fetch(url);
    let blobData=res.blob();
    
    const {size, type} = blobData
    console.log(size, type);
    // alert(` 🌅 IMG Type: ${type} \n 🌌 IMG Size: ${size}`)
    
    return blobData;
}

async function listFiles(){
    const listRef = ref(storage, '');
    let output=[];

    let res=await listAll(listRef);
    
    let len=res.items.length;
    for(var i=0;i<len;++i){
        let itemRef=res.items[i];
        let url=await getDownloadURL(ref(storage, itemRef.name));
        output.push(url);
    };
    
    return output;
}


export {uploadStorage, dataURItoBlob, fetchToBlob, listFiles};