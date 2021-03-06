import * as firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

class Firebase {
  constructor() {
    firebase.initializeApp(config)
    this.auth = firebase.auth()
  }

  // Auth API

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

  doGetCurrentUser = () => firebase.auth().currentUser

  doOnAuthStateChange = () => firebase.auth().onAuthStateChanged

  doDeleteUser = () => firebase.auth().currentUser.delete()

  doReauthenticateWithCredential = (credential, next, onError) => {
    const user = this.auth.currentUser
    user
      .reauthenticateWithCredential(credential)
      .then(next())
      .catch(err => onError(err))
  }

  onAuthUserListener = (next, fallback) => {
    this.doOnAuthStateChange(authUser => {
      if (authUser) {
        next(authUser)
      } else {
        fallback()
      }
    })
  }

  // Utils

  transformFirebaseUserToStateUser = firebaseUser => {
    const userProperties = [
      'displayName',
      'email',
      'emailVerified',
      'isAnonymous',
      'photoURL',
      'providerId',
      'refreshToken',
      'uid',
      'isAdmin'
    ]

    return userProperties.reduce((obj, prop) => {
      return prop in firebaseUser ? { ...obj, [prop]: firebaseUser[prop] } : obj
    }, Object.create(null))
  }
}

export default new Firebase()
