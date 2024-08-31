import React, { useState } from 'react'
import "bootstrap"
import { Link } from 'react-router-dom'
import LoginValidation from "./validation/LoginValidation"
function Login() {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(LoginValidation(values));
    }
    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-light p-4 rounded w-25 border border-dark'>
                <h2>Log in</h2>
                <form action='' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input onChange={handleInput} type='email' placeholder='Enter Email' className='form-control rounded' name='email'></input>
                        {errors.email && <span className='text-danger fst-italic'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input onChange={handleInput} type='password' placeholder='Enter password' className='form-control rounded' name='password'></input>
                        {errors.password && <span className='text-danger fst-italic'>{errors.password}</span>}

                    </div>
                    <button type='submit' className='btn btn-success w-100'><strong>Log in</strong></button>
                    <p>You are agree to our terms and policies</p>
                    <Link to='/register' className='btn btn-default border w-100 bg-light'>Create Account</Link>

                </form>
            </div>
        </div>
    )
}

export default Login