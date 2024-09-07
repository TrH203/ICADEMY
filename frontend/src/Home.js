import React, { useState } from 'react';
import './css/Home.css';

function Home() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="Home">
            <h1 className='brand-name'>EDAICT.PRO</h1>
            {!isOpen ? <button className="open-btn" onClick={toggleMenu}>
                ☰ Open Menu
            </button> : ""}
            <div className={`overlay-nav ${isOpen ? 'open' : ''}`}>
                <span className="close-btn" onClick={toggleMenu}>&times;</span>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/payment">Payment</a></li>
                    <li><a href="/vm">EDA Server</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
