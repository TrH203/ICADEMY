import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RegisterValidation from "./validation/RegisterValidation"
import axios from 'axios'

function Register() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        re_password: '',
        validation_code: '',
    });
    const [isSummiting, SetIsSubmiting] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [registerStatus, setRegisterStatus] = useState("");

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

    const handleVerify = (event) => {
        event.preventDefault();
        console.log(values);

        setIsVerify(false);
    }

    useEffect(() => {
        if (isSummiting) {
            let isValid = Object.values(errors).every(error => error === "");
            setRegisterStatus("");
            if (isValid) {
                axios.post('http://localhost:8081/register', values)
                    .then(res => {
                        setIsVerify(true);
                    })
                    .catch(err => {
                        setRegisterStatus(err.response.data.error);
                    });
            }
        }
        SetIsSubmiting(false);

    })
    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-light p-4 rounded w-25 border border-dark'>
                <h2>Register</h2>
                <form action='' onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='name'><strong>Name</strong></label>
                        <input onChange={handleInput} type='text' placeholder='Enter Name' className='form-control rounded' name='name'></input>
                        {errors.name && <span className='text-danger fst-italic'>{errors.name}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='`email`'><strong>Email</strong></label>
                        <input onChange={handleInput} type='email' placeholder='Enter Email' className='form-control rounded' name='email'></input>
                        {errors.email && <span className='text-danger fst-italic'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input onChange={handleInput} type='password' placeholder='Enter password' className='form-control rounded' name='password'></input>
                        {errors.password && <span className='text-danger fst-italic'>{errors.password}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='re-password'><strong>Re-Password</strong></label>
                        <input onChange={handleInput} type='password' placeholder='Enter re-password' className='form-control rounded' name='re_password'></input>
                        {errors.re_password && <span className='text-danger fst-italic'>{errors.re_password}</span>}
                    </div>
                    {registerStatus && <span className='text-danger fst-italic'>{registerStatus}</span>}
                    <p>You are agree to our terms and policies</p>
                    <button className='mb-3 btn btn-success w-100'><strong>Sign Up Now</strong></button>

                    {isVerify && <div className='mb-3'>
                        <label htmlFor='validation-code'><strong>Validation Code</strong></label>
                        <input onChange={handleInput} type='text' placeholder='XXXXX' className='mb-3 form-control rounded' name='validation_code'></input>
                        <button className='btn btn-warning w-100' onClick={handleVerify}><strong>Verify</strong></button>
                    </div>}

                    <Link to='/' className='btn btn-default border w-100 bg-light'>Return login</Link>

                </form>
            </div>
        </div>
    )
}

export default Register