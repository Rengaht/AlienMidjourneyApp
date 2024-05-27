import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import { getDatabase, ref as db_ref, set, onValue  } from "firebase/database";

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
const database = getDatabase(app);

let history_record={};

async function uploadStorage(file, name){

    try{
    
        let timestr=Moment().format( "YYYYMMDDhhmm" );
        const storageRef = ref(storage, `${timestr}__${name}.png`);
        let snapshot=await uploadBytes(storageRef, file);
        
        console.log('Uploaded a blob or file!', snapshot);
        
        let url=await getDownloadURL(ref(storage, snapshot.ref.name));       
        return url;

    }catch(err){
        console.log('upload err',err);
    }
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
async function deleteTestFiles(itemRef){

    if(itemRef.name=='202405270809__test~~~.png'
    || itemRef.name=='202405270810__test_2.png'
    || itemRef.name=='202405270815__test_3.png'
    || itemRef.name=='202405270816__test4.png'
    || itemRef.name=='202405270817__test_5.png'
    || itemRef.name=='202405270818__test_444.png'
    || itemRef.name=='202405270819__test6_.png'){
        try{            
            let del=await deleteObject(ref(storage, itemRef.name));
            console.log('delete', itemRef.name, del);
        }catch(err){
            console.error(err);
        }

    }
}
async function listFiles(){
    const listRef = ref(storage, '');
    let output=[];

   
    let res=await listAll(listRef);

    let len=res.items.length;
    let limit=Math.min(len, 102);
    console.log('total image', len, 'load', limit);

    for(var i=0;i<limit;++i){
        let itemRef=res.items[len-limit+i];

        // deleteTestFiles(itemRef);

        // console.log(itemRef);
        if(history_record[itemRef.name]){
            // console.log('find in history', i);
            output.unshift(history_record[itemRef.name]);
        }else{
            console.log('fetch downalodURL', i);
            try{
                let url=await getDownloadURL(ref(storage, itemRef.name));
                output.unshift(url);

                history_record[itemRef.name]=url;

            }catch(err){
                console.log('getDownloadURL err',err);
            }
        }
    };
    // console.log(output);
    return output;
}

function selectFile(file){

    set(db_ref(database, 'current'), {
      url: file,
    });
}

function selectListener(callback){
    const starCountRef = db_ref(database, 'current');
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}

export {uploadStorage, dataURItoBlob, fetchToBlob, listFiles, selectFile, selectListener};