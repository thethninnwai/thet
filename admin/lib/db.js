import firebase from 'firebase/app'
import 'firebase/firestore'
export function loadFirebase(){
    try{
  const Config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
   
  };
 
  firebase.initializeApp(Config);
  firebase.firestore().settings({timestampsInSnapshots:true})
  
 
}catch (error){
    if(!/already exist/.test(error.message)){
        console.log(`Firebase did not initialize correctly:${error.message}`)
    }
}
return firebase
}