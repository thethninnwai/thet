import firebase, { app } from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_API,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const db = firebase.firestore();
export const JOB_COLLECTION = firebase.firestore().collection('job')
export const AREA_COLLECTION = firebase.firestore().collection('area')
export const CITY_COLLECTION = firebase.firestore().collection('city')
export const EMPLOYER_COLLECTION = firebase.firestore().collection('employer') 

export const getCollectionRecords = async (collection,limit=0) => {
  let data = []
  let query =  collection
  if(limit>0) {
    query = query.limit(limit)
  }
  const querySnapshot = await query.get()
  querySnapshot.forEach(doc => {
      data.push(Object.assign(
          {id : doc.id,
        data : doc.data()}
      ))
    })
  return data 
} 


export default firebase;