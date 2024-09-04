require('dotenv').config();

const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const JWT_SECRET = process.env.JWT_SECRET;


app.get('/', (req, res) => {
    return res.json("Here is /");
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const values = [
        name, email, password
    ]
    //console.log(name);

    db.query(sql, [values], (err, data) => {
        //console.log(sql);
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        return res.status(201).json({ message: 'User registered successfully' });
    })
})


app.post('/request-email-code', (req, res) => {
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

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to send email' });
            }
            res.json({ message: 'Validation code sent' });
        });
    });
});

app.post('/validate-email-code', (req, res) => {
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


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const values = [
        email, password
    ];
    //console.log(values);

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
    })
})
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
// Protected route
app.get('/payment', authMiddleware, async (req, res) => {
    const sql = 'SELECT * FROM login WHERE id = ?';
    db.query(sql, [req.userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json("ok");
    })
});
app.get('/profile', authMiddleware, async (req, res) => {
    const sql = 'SELECT * FROM login WHERE id = ?';
    db.query(sql, [req.userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json("ok");
    })
});
app.get('/vm', authMiddleware, async (req, res) => {
    const sql = 'SELECT * FROM login WHERE id = ?';
    db.query(sql, [req.userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json("ok");
    })
});

app.listen(8081, () => {
    console.log("listening");
})

