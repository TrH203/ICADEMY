require('dotenv').config();

const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const jwt = require('jsonwebtoken');

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
        console.log(sql);
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const values = [
        email, password
    ];
    //console.log(values);

    db.query(sql, values, (err, data) => {
        console.log(sql);
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (data.length === 0) {
            return res.status(400).json({ error: 'Login failed: Invalid email or password' });
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

