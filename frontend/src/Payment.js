import React from 'react';
import axios from 'axios';

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
    <div>
      <h1>Shoes</h1>
      <h2>Buy For $25</h2>
      <form onSubmit={handleSubmit}>
        <input type="submit" value="Buy" />
      </form>
    </div>
  );
}

export default Payment;