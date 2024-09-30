import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// Footer Component
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>EDAICT.pro</h5>
            <p>Your trusted partner in digital solutions.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-light">Home</a></li>
              <li><a href="#services" className="text-light">Services</a></li>
              <li><a href="#about" className="text-light">About</a></li>
              <li><a href="#contact" className="text-light">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <address>
              123 Tech Street<br />
              Innovation City, IC 12345<br />
              Email: info@edaict.pro<br />
              Phone: (123) 456-7890
            </address>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="row">
          <div className="col-md-12 text-center">
            <p>&copy; 2024 EDAICT.pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };