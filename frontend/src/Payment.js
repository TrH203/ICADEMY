import React from 'react';
import axios from 'axios';
import './css/Payment.css';

function Payment() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3015/pay');
      window.location.href = response.data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='Container'>
      <h1>IC1</h1>
      <h2>$25</h2>
      <h3>ALL-IN-ONE</h3>
      <form onSubmit={handleSubmit}>
        <input type="submit" value="Buy" />
      </form>
    </div>
  );
}

export default Payment