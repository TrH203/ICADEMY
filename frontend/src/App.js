import React from 'react'
import './Login'
import Login from './Login'
import Register from "./Register"
import Home from './Home'
import Payment from "./Payment"
import VM from "./VM"
import ProtectedRoute from './ProtectedRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute>
                            <Payment />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/vm"
                    element={
                        <ProtectedRoute>
                            <VM />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App