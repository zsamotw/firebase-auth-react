import { call, put, takeLatest, all } from 'redux-saga/effects'
import {
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  SIGNUP_REQUEST,
  SET_AUTH_USER,
  SET_IS_FETCHING_DATA
} from './actions'
import Firebase from '../components/Firebase'

function* login(action) {
  yield put(
    SET_IS_FETCHING_DATA({
      payload: { type: 'isFetchingLoginData', value: true }
    })
  )
  const {
    email,
    password,
    callbacks: { setAuthUserInLocalStorage, setError }
  } = action.payload
  try {
    const { user } = yield call(
      Firebase.doSignInWithEmailAndPassword,
      email,
      password
    )
    const currentUser = Firebase.transformFirebaseUserToStateUser(user)
    yield put(SET_AUTH_USER({ payload: currentUser }))
    setAuthUserInLocalStorage(currentUser)
    yield put(
      SET_IS_FETCHING_DATA({
        payload: { type: 'isFetchingLoginData', value: false }
      })
    )
  } catch (error) {
    setError(error)
    yield put(
      SET_IS_FETCHING_DATA({
        payload: { type: 'isFetchingLoginData', value: false }
      })
    )
  }
}

function* logout(action) {
  const { callback } = action.payload
  yield call(Firebase.doSignOut)
  yield put(SET_AUTH_USER({ payload: null }))
  callback(null)
}

function* signUp(action) {
  yield put(
    SET_IS_FETCHING_DATA({
      payload: { type: 'isFetchingSignUpData', value: true }
    })
  )
  const {
    displayName,
    email,
    password,
    callbacks: { setAuthUserInLocalStorage, setError }
  } = action.payload
  try {
    const user = yield call(
      Firebase.doCreateUserWithEmailAndPassword,
      email,
      password
    )
    if (user) {
      const loggedUser = yield call(Firebase.doGetCurrentUser)
      yield call(loggedUser.updateProfile.bind(loggedUser), { displayName })
      const currentUser = Firebase.transformFirebaseUserToStateUser(loggedUser)
      yield put(SET_AUTH_USER({ payload: currentUser }))
      setAuthUserInLocalStorage(currentUser)
      yield put(
        SET_IS_FETCHING_DATA({
          payload: { type: 'isFetchingSignUpData', value: false }
        })
      )
    }
  } catch (error) {
    setError(error)
    yield put(
      SET_IS_FETCHING_DATA({
        payload: { type: 'isFetchingSignUpData', value: false }
      })
    )
  }
}

function* appSaga() {
  yield takeLatest(LOGIN_REQUEST.type, login)
  yield takeLatest(LOGOUT_REQUEST.type, logout)
  yield takeLatest(SIGNUP_REQUEST.type, signUp)
}

export default function* rootSaga() {
  yield all([appSaga()])
}
