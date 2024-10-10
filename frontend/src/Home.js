import React from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';
import TawkToWidget from './TawkToChat';
import { Footer } from './components/HF';
function Home() {
  return (
    <div className="home">
      <header>
        <div className="logo">RDP Solutions</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn-login">Log In</Link>
          <Link to="/register" className="btn-register">Sign Up</Link>
        </div>
      </header>
      <main className="main-content">
      <section class="villian">
      <div class="villian-content">
                <h1>Welcome to our RDP Product Website</h1>
                <p>Experience the power and convenience of our reliable RDP products.</p>
                <div class="hero-buttons">
                    <button class="btn-solid">Register</button>
                    <button class="btn-outline">Login</button>
                </div>
            </div>
        
            <div class="villian-image">
               IMG
            </div>
        </section>
        <section className="hero">
          <div className="hero-content">
            <h1>Revolutionize Your Remote Work</h1>
            <p>Discover the next generation of RDP solutions for seamless, secure, and efficient remote access.</p>
            <div className="hero-buttons">
              <Link to="/demo" className="btn-primary">Request Demo</Link>
              <Link to="/learn-more" className="btn-outline">Learn More</Link>
            </div>
          </div>
        </section>
        <section className="features">
          <h2>Why Choose Our RDP Solutions?</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <i className="icon-security"></i>
              <h3>Enhanced Security</h3>
              <p>State-of-the-art encryption and multi-factor authentication.</p>
            </div>
            <div className="feature-item">
              <i className="icon-performance"></i>
              <h3>High Performance</h3>
              <p>Lightning-fast connections with minimal latency.</p>
            </div>
            <div className="feature-item">
              <i className="icon-scalability"></i>
              <h3>Scalability</h3>
              <p>Easily adapt to your growing business needs.</p>
            </div>
            <div className="feature-item">
              <i className="icon-support"></i>
              <h3>24/7 Support</h3>
              <p>Round-the-clock assistance from our expert team.</p>
            </div>
            <Footer/>
            <TawkToWidget />
        </div>
    );
}

export default Home;
