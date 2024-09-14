require('dotenv').config();

const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const paypal = require('paypal-rest-sdk');

// Configure express;
const paypalApp = express();
const mainApp = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

paypalApp.use(cors(corsOptions));
mainApp.use(cors(corsOptions));

paypalApp.use(express.json());
mainApp.use(express.json());

const PAYPAL_PORT = 3015;
const MAIN_PORT = 8081;

// PayPal Configuration
paypal.configure({
  'mode': 'sandbox',
  'client_id': 'Aeo09eoIkbbZsyWJCladk8e80iCaz2YojTWf0NDlV6ILG-yq-etmA9WCOton1a33xHbtxMTZSSCCIIl6',
  'client_secret': 'EJFQlEIvxHxjiMLcJ1Xe8DxEUL8OdcSwpQeQcqMYrWu8jzYfb7UTZfbpcii9BUlQr1kW9fFTpQWiGISa'
});

// PayPal Routes
paypalApp.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://localhost:3000/success",
      "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Shoes",
          "sku": "001",
          "price": "25.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "25.00"
      },
      "description": "Shoes for $25.00"
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create PayPal payment' });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.json(payment.links[i].href);
          return;
        }
      }
      res.status(500).json({ error: 'No PayPal approval URL found' });
    }
  });
});

paypalApp.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Payment execution failed' });
    } else {
      console.log("Payment executed successfully");
      res.send("Payment completed successfully");
    }
  });
});

paypalApp.get('/cancel', (req, res) => res.send('Payment cancelled'));

// Main App Routes and Configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const JWT_SECRET = process.env.JWT_SECRET;

mainApp.get('/', (req, res) => {
  return res.json("Here is /");
});

mainApp.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
  const values = [name, email, password];

  db.query(sql, [values], (err, data) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(201).json({ message: 'User registered successfully' });
  });
});

mainApp.post('/request-email-code', (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit validation code
  const validationCode = crypto.randomInt(100000, 999999).toString();

  // Store the code in the database with the email
  const sql = "INSERT INTO email_validation (email, code) VALUES (?, ?)";
  db.query(sql, [email, validationCode], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Send email with the code
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Validation Code',
      text: `Your validation code is: ${validationCode}`
    };
    try {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ error: 'Failed to send email' });
        }
        res.json({ message: 'Validation code sent' });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" });
    }
  });
});

mainApp.post('/validate-email-code', (req, res) => {
  const { email, code, name, password } = req.body;

  // Check if the code matches
  const sql = "SELECT * FROM email_validation WHERE email = ? AND code = ?";
  db.query(sql, [email, code], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    // Code is valid, complete the registration
    const insertUserSql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertUserSql, [name, email, password], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to register user' });
      }

      // Delete the validation code after successful registration
      const deleteCodeSql = "DELETE FROM email_validation WHERE email = ?";
      db.query(deleteCodeSql, [email], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to clean up validation code' });
        }
        res.json({ message: 'Registration successful' });
      });
    });
  });
});

mainApp.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  const values = [email, password];

  db.query(sql, values, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (data.length === 0) {
      return res.status(401).json({ error: 'Login failed: Invalid email or password' });
    }

    const user = data[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ "token": token });
  });
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
};

// Protected routes
mainApp.get('/payment', authMiddleware, async (req, res) => {
  const sql = 'SELECT * FROM login WHERE id = ?';
  db.query(sql, [req.userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json("ok");
  });
});

mainApp.get('/profile', authMiddleware, async (req, res) => {
  const sql = 'SELECT * FROM login WHERE id = ?';
  db.query(sql, [req.userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json("ok");
  });
});

mainApp.get('/vm', authMiddleware, async (req, res) => {
  const sql = 'SELECT * FROM login WHERE id = ?';
  db.query(sql, [req.userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json("ok");
  });
});

// Check if connection is successful
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Start both servers
paypalApp.listen(PAYPAL_PORT, () => console.log(`PayPal Server Started on ${PAYPAL_PORT}`));
mainApp.listen(MAIN_PORT, () => console.log(`Main Server Started on ${MAIN_PORT}`));
