import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loadingSpinner from './loadingSpinner.gif'
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik'

const Signup = () => {

  const backendLink = process.env.REACT_APP_BACKEND_LINK

  const navigateTo = useNavigate()

  const [signUpMessage, setSignUpMessage] = useState('')
  const [alertType, setAlertType] = useState('danger')
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)

  const signUpSchema = Yup.object({
    name: Yup.string().min(2, "Name should be at least 2 character long").required("This field is required*"),
    email: Yup.string().email("Invalid email address!").required("This field is required*"),
    password: Yup.string().min(5, "Password should be at least 5 character long").required("This field is required*"),
    cpassword: Yup.string().required("This field is required*").oneOf([Yup.ref('password'), null], "Confirm Password must be same as password")
  })

  const handleSignup = async (values) => {

    setLoading(true)
    const response = await fetch(`${backendLink}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values }),
    })
    const json = await response.json()
    setLoading(false)

    if (!json.success) {
      setSignUpMessage(json.message)
      setIsActive(true)
      setTimeout(() => {
        setIsActive(false)
      }, 3000);
    } else {

      setSignUpMessage(json.message)
      setAlertType('success')
      setIsActive(true)

      setTimeout(() => {
        navigateTo('/login')
      }, 2000);
    }
  }

  return (
    <main className='mt-5'>
      <h2>Create Account - Ai Blog</h2>
      <div className='container mt-3 d-flex justify-content-center'>
        {loading && <img style={{ width: "70px" }} src={loadingSpinner} alt="loading..." />}
      </div>
      <div id='signUpSuccess' className={`alert ${alertType === 'danger' ? 'alert-danger' : 'alert-success'} ${!isActive ? 'd-none' : null}`} role="alert">
        {signUpMessage}
      </div>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          cpassword: "",
        }}
        validationSchema={signUpSchema}
        onSubmit={(values) => {
          handleSignup(values)
        }}
        errors={(errors) => {
          console.log(errors)
        }}
      >
        {({ errors, touched, handleBlur, handleSubmit }) => (
          <Form className='mt-3' onSubmit={handleSubmit}>
            <div className="my-2">
              <label htmlFor="name" className="form-label">Full Name</label>
              <Field
                className="form-control" id="name"
                type="text"
                name="name"
                placeholder='Your Full Name'
                onBlur={handleBlur}
              />
              {errors.name && touched.name ? <p className=' text-danger' >{errors.name}</p> : null}
            </div>
            <div className="my-2">
              <label htmlFor="email" className="form-label">Email address</label>
              <Field
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder='Your E-mail address'
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? <p className=' text-danger' >{errors.email}</p> : null}
            </div>
            <div className="my-2">
              <label htmlFor="password" className="form-label">Password</label>
              <Field
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder='New Password'
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? <p className=' text-danger' >{errors.password}</p> : null}
            </div>
            <div className="my-2">
              <label htmlFor="cpassword" className="form-label">Confirm Password</label>
              <Field
                type="password"
                className="form-control"
                id="cpassword"
                name="cpassword"
                placeholder='Confirm Password'
                onBlur={handleBlur}
              />
              {errors.cpassword && touched.cpassword ? <p className=' text-danger' >{errors.cpassword}</p> : null}
            </div>
            <div className="d-flex align-items-center my-3">
              <button type="submit" className="btn btn-primary">Submit</button>
              <p className="mx-2 my-0">Already member - <Link to="/login">Login to Ai Blog</Link></p>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  )
}

export default Signup
