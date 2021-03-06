import { createReducer } from '@reduxjs/toolkit'
import { Record } from 'immutable'
import {
  handleSetAuthUser,
  handleSetAppMessage,
  handleSetIsFetchingData
} from './action-handlers'
import { SET_AUTH_USER, SET_APP_MESSAGE, SET_IS_FETCHING_DATA } from './actions'

const makeInitialState = Record({
  currentUser: null,
  isFetchingData: {
    isFetchingLoginData: false,
    isFetchingSignUpdData: false,
    isFetchingSignOutData: false,
    isFetchingUpdateUserAccountData: false,
    isFetchingChangePasswordData: false
  },
  appMessage: { content: '', type: null }
})

const initialState = makeInitialState()

const appReducers = createReducer(initialState, {
  [SET_AUTH_USER.type]: (state, action) => {
    return handleSetAuthUser(state, action.payload)
  },
  [SET_APP_MESSAGE.type]: (state, action) => {
    return handleSetAppMessage(state, action.payload)
  },
  [SET_IS_FETCHING_DATA.type]: (state, action) => {
    return handleSetIsFetchingData(state, action.payload)
  }
})

export default appReducers
