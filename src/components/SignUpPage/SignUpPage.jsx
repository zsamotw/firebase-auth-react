import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { useForm } from 'react-hook-form'
import ButtonWithProgress from '../ButtonWithProgress'
import { getIsFetchingData } from '../../store/selectors'
import { SIGNUP_REQUEST } from '../../store/actions'
import AppInput from '../AppInput'

const SignUpPage = () => (
  <div>
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
)

const useStyles = makeStyles({
  errorBar: {
    color: 'red'
  }
})

const SignUpFormBase = props => {
  const { isFetchingSignUpData, signUp } = props

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [passwordOne, setPasswordOne] = useState('')
  const [passwordTwo, setPasswordTwo] = useState('')
  const [error, setError] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, errors } = useForm()

  const classes = useStyles()

  useEffect(() => {
    setIsLoading(isFetchingSignUpData)
  }, [isFetchingSignUpData])

  const onSubmit = () => {
    signUp(displayName, email, passwordOne, {
      setError
    })
  }

  const userNameInputProps = {
    id: 'userName-input',
    label: 'User Name',
    variant: 'outlined',
    name: 'userName',
    value: displayName,
    onChange: event => setDisplayName(event.target.value),
    type: 'text',
    placeholder: 'Type your name...',
    register: register({
      required: 'Required'
    }),
    error: errors.userName
  }
  const emailInputProps = {
    id: 'email-input',
    label: 'Email',
    variant: 'outlined',
    name: 'email',
    value: email,
    onChange: event => setEmail(event.target.value),
    type: 'text',
    placeholder: 'Type your email...',
    register: register({
      required: 'Required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        message: 'Invalid email address'
      }
    }),
    error: errors.email
  }
  const passwordOneInputProps = {
    id: 'passwordOne-input',
    label: 'Password',
    variant: 'outlined',
    name: 'passwordOne',
    value: passwordOne,
    onChange: event => setPasswordOne(event.target.value),
    type: 'password',
    placeholder: 'Type your password...',
    register: register({
      required: 'Required',
      minLength: { value: 6, message: 'Password should have 6 letters' }
    }),
    error: errors.passwordOne
  }
  const passwordTwoInputProps = {
    id: 'passwordTwo-input',
    label: 'Password Confirmation',
    variant: 'outlined',
    name: 'passwordTwo',
    value: passwordTwo,
    onChange: event => setPasswordTwo(event.target.value),
    type: 'password',
    placeholder: 'Confirm your password...',
    register: register({
      required: 'Required',
      minLength: { value: 6, message: 'Password should have 6 letters' },
      validate: value =>
        value === passwordOne || 'Incorrect password confirmation'
    }),
    error: errors.passwordTwo
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>{AppInput(userNameInputProps)}</div>
      <div>{AppInput(emailInputProps)}</div>
      <div>{AppInput(passwordOneInputProps)}</div>
      <div>{AppInput(passwordTwoInputProps)}</div>
      <ButtonWithProgress
        variant="contained"
        color="primary"
        type="submit"
        size="large"
        isLoading={isLoading}
        text="Sign Up"
      />
      <div className={classes.errorBar}>{error && <p>{error.message}</p>}</div>
    </form>
  )
}

function mapStateToProps(state) {
  const { isFetchingSignUpData } = getIsFetchingData(state)
  return { isFetchingSignUpData }
}

function mapDispatchToState(dispatch) {
  return {
    signUp: (displayName, email, password, callbacks) =>
      dispatch(
        SIGNUP_REQUEST({ payload: { displayName, email, password, callbacks } })
      )
  }
}

const SignUpForm = connect(mapStateToProps, mapDispatchToState)(SignUpFormBase)

export { SignUpForm, SignUpPage }
