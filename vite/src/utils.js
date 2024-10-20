import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL, deleteObject} from "firebase/storage";
import { getDatabase, ref as db_ref, set, onValue  } from "firebase/database";
import { getFirestore, collection, doc, addDoc, onSnapshot, setDoc} from "firebase/firestore";

import Moment from "moment";
import { saveAs } from 'file-saver';


// const firebaseConfig = {
//     apiKey: "AIzaSyBHyYTbsVoX-7mFXvnlB8ck6YHJIAiIy5A",
//     authDomain: "alienmidjourneyapp.firebaseapp.com",
//     projectId: "alienmidjourneyapp",
//     storageBucket: "alienmidjourneyapp.appspot.com",
//     messagingSenderId: "26773746518",
//     appId: "1:26773746518:web:fb673f825b3a6f7e741cf7",
//     measurementId: "G-4QGS9ZDNWW"
// };

const firebaseConfig = {
    apiKey: "AIzaSyAgwjbzf1jqetiao_VnZ5C4xTFVeTvU_Y0",
    authDomain: "inneralien-ac428.firebaseapp.com",
    projectId: "inneralien-ac428",
    storageBucket: "inneralien-ac428.appspot.com",
    messagingSenderId: "302384228850",
    appId: "1:302384228850:web:086f52c29feb408417a36b",
    measurementId: "G-76Y68P70TL"
  };
  

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const database = getDatabase(app);
const datastore=getFirestore(app);

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

async function uploadCloudinary(file, name){

    try{
        let url='https://api.cloudinary.com/v1_1/fuyuanmuseum/image/upload';
        let data=new FormData();
        data.append('file', file);
        data.append('upload_preset', 'inneralien');

        let res=await fetch(url, {
            method: 'POST',
            body: data,
        });
        console.log('Uploaded a blob or file!', res);
        
        let res_data=await res.json();
        console.log(res_data);
        return res_data.secure_url;

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

    if(itemRef.name=='202405280908__test~~.png'
    || itemRef.name=='202405280909__test~~~.png'){
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

async function downalodFiles(){
    const listRef = ref(storage, '');
    let output=[];

   
    let res=await listAll(listRef);

    let len=res.items.length;
    let limit=len;//Math.min(len, 1);
    console.log('total image', len, 'load', limit);

    for(var i=0;i<limit;++i){
        let itemRef=res.items[len-limit+i];

        try{
            let url=await getDownloadURL(ref(storage, itemRef.name));
            
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
              const blob = xhr.response;
              
                saveAs(blob, `${itemRef.name}.png`);

            };
            xhr.open('GET', url);
            xhr.send();
        


        }catch(err){
            console.log('getDownloadURL err',err);
        }
    }
    
}

async function selectFile(record, workshop){
    console.log('select file', record);
    // set(db_ref(database, 'current'), {
    //   url: file,
    // });
    if(workshop!=null){
        const currentRef=doc(datastore, "current", `record_${workshop}`);
        await setDoc(currentRef, record);
    }else{
        const currentRef=doc(datastore, "current", 'record');
        await setDoc(currentRef, record);
    }

}

function selectListener(callback, workshop){
    // const starCountRef = db_ref(database, 'current');
    // onValue(starCountRef, (snapshot) => {
    //     const data = snapshot.val();
    //     callback(data);
    // });
    if(workshop!=null){
        const ref=doc(datastore, "current", `record_${workshop}`);
        onSnapshot(ref, (doc) => {
            callback(doc.data());
        });
    }else{

        const ref=doc(datastore, "current", 'record');
        onSnapshot(ref, (doc) => {
            callback(doc.data());
        });
    }
}

async function saveRecords(prompt, url){

    const docRef = collection(datastore, "records");
    await addDoc(docRef, {
        prompt: prompt,
        url: url,
        time: Moment().format( "YYYY-MM-DD hh:mm" ),
    });
    
}

function getRecords(callback){
    const starCountRef = collection(datastore, 'records');
    onSnapshot(starCountRef, (snapshot) => {
        
        let output=[];
        snapshot.forEach((doc) => {
            output.push(doc.data());
        });
        console.log('records updated', output);

        callback(output);
    });
}





export {uploadStorage,uploadCloudinary, dataURItoBlob, fetchToBlob, listFiles, selectFile, selectListener, downalodFiles,
    saveRecords, getRecords
};