import React, { useState } from 'react'
import './CSS/Login.css'
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'

const Login = () => {

  const backendLink = process.env.REACT_APP_BACKEND_LINK

  let navigateTo = useNavigate();

  const [signUpMessage, setSignUpMessage] = useState('')
  const [alertType, setAlertType] = useState('danger')
  const [isActive, setIsActive] = useState(false)

  const LogInSchema = Yup.object({
    email: Yup.string().email("Invalid email address!").required("Email is required*"),
    password: Yup.string().required("Password is required*")
  })

  const handleLoginSubmit = async (values) => {

    const response = await fetch(`${backendLink}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values }),
    })
    const json = await response.json();

    if (!json.success) {
      setSignUpMessage(json.message)
      setIsActive(true)
      setTimeout(() => {
        setIsActive(false)
      }, 3000);
    } else {

      localStorage.setItem('token', json.authToken);
      localStorage.setItem('userName', json.userName);
      if (json.isAdmin) {
        localStorage.setItem('admin', json.isAdmin);
      }
      setSignUpMessage(json.message)
      setAlertType('success')
      setIsActive(true)

      setTimeout(() => {
        navigateTo('/')
      }, 2000);
    }
  }

  return (
    <main className='mt-5'>
      <h2>Login to Ai Blogs</h2>
      <div id='signUpSuccess' className={`alert ${alertType === 'danger' ? 'alert-danger' : 'alert-success'} ${!isActive ? 'd-none' : null}`} role="alert">
        {signUpMessage}
      </div>
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        validationSchema={LogInSchema}
        onSubmit={(values) => {
          handleLoginSubmit(values)
        }}
        errors={(errors) => {
          console.log(errors)
        }}
      >
        {({ errors, touched, handleBlur, handleSubmit }) => (
          <Form className='mt-4' onSubmit={handleSubmit}>
            <div className="form-group my-3">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <Field
                type="email"
                name='email'
                className="form-control"
                placeholder="Enter email"
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? <p className=' text-danger' >{errors.email}</p> : null}
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group my-3">
              <label htmlFor="exampleInputPassword1">Password</label>
              <Field
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? <p className=' text-danger' >{errors.password}</p> : null}
            </div>
            <div className="d-flex align-items-center my-3">
              <button type="submit" className="btn btn-primary">Submit</button>
              <p className="mx-2 my-0">New to Ai Blogs - <a href="/signup">Create a Account</a></p>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  )
}

export default Login
