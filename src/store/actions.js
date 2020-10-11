import { createAction } from '@reduxjs/toolkit'

export const SET_AUTH_USER = createAction('SET AUTH USER', user => user)
export const SET_APP_MESSAGE = createAction(
  'SET APP MESSAGE',
  message => message
)
export const SET_IS_FETCHING_DATA = createAction(
  'IS FETCHING DATA',
  data => data
)

export const LOGIN_REQUEST = createAction(
  'LOGIN REQUEST',
  credential => credential
)
export const LOGOUT_REQUEST = createAction(
  'LOGOUT REQUEST',
  callback => callback
)
export const SIGNUP_REQUEST = createAction('SIGNUP REQUEST', data => data)
