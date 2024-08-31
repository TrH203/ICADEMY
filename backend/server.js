const express = require("express");
const mysql = require("mysql");
const cors = require('cors');


const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup',
})

app.get('/', (req, res) => {
    return res.json("Here is /");
})

app.post('/register', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("ERROR");
        }
        return res.json(data);
    })
})

app.listen(8081, () => {
    console.log("listening");
})

