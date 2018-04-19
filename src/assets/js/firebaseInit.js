/**
 * Created by Ghobe on 2018-03-31.
 */
import firebase from 'firebase'
// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAKIphvz0lQNchZUV4lpeueaSz9oArKbT4',
  authDomain: 'changediary-457f5.firebaseapp.com',
  databaseURL: 'https://changediary-457f5.firebaseio.com',
  projectId: 'changediary-457f5',
  storageBucket: 'changediary-457f5.appspot.com',
  messagingSenderId: '721839906084'
}

var initNode = firebase.initializeApp(config)

export default {
  initNode: initNode
}
