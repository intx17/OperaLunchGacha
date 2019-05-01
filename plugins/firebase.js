import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBNEyrQnh8TdPa8d1S6KFLUHETxnpB79mA",
    authDomain: "operalunchgacha.firebaseapp.com",
    databaseURL: "https://operalunchgacha.firebaseio.com",
    projectId: "operalunchgacha",
    storageBucket: "operalunchgacha.appspot.com",
    messagingSenderId: "511500955048"
  })
}

const db = firebase.firestore()
const settings = { timestampsInSnapshots: true }
db.settings = settings
export { db }