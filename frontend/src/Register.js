import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RegisterValidation from "./validation/RegisterValidation"
import axios from 'axios'
function Register() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        re_password: ''
    });
    const [isSummiting, SetIsSubmiting] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        re_password: ''
    })

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        setErrors(RegisterValidation(values));
        SetIsSubmiting(true);
    }

    useEffect(() => {
        if (isSummiting) {
            let isValid = Object.values(errors).every(error => error === "");

            if (isValid) {
                axios.post('http://localhost:8081/register', values)
                    .then(res => console.log(res))
                    .catch(err => console.log(err));
            }
        }
    })
    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-light p-4 rounded w-25 border border-dark'>
                <h2>Register</h2>
                <form action='' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'><strong>Name</strong></label>
                        <input onChange={handleInput} type='text' placeholder='Enter Name' className='form-control rounded' name='name'></input>
                        {errors.name && <span className='text-danger fst-ilatic'>{errors.name}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='`email`'><strong>Email</strong></label>
                        <input onChange={handleInput} type='email' placeholder='Enter Email' className='form-control rounded' name='email'></input>
                        {errors.email && <span className='text-danger fst-ilatic'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input onChange={handleInput} type='password' placeholder='Enter password' className='form-control rounded' name='password'></input>
                        {errors.password && <span className='text-danger fst-ilatic'>{errors.password}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='re-password'><strong>Re-Password</strong></label>
                        <input onChange={handleInput} type='password' placeholder='Enter re-password' className='form-control rounded' name='re_password'></input>
                        {errors.re_password && <span className='text-danger fst-ilatic'>{errors.re_password}</span>}
                    </div>
                    <button className='btn btn-success w-100'><strong>Sign Up Now</strong></button>
                    <p>You are agree to our terms and policies</p>
                    <Link to='/' className='btn btn-default border w-100 bg-light'>Return login</Link>

                </form>
            </div>
        </div>
    )
}

export default Register