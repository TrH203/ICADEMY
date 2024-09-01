import React from 'react'
import './Login'
import Login from './Login'
import Register from "./Register"
import Home from './Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/home' element={<Home />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App