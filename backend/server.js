const express = require("express");
const mysql = require("mysql");
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json())

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
            return res.json(err);
        }
        if (data.length != 0) {
            return res.json("success");
        }
        return res.json("error");
    })
})
app.listen(8081, () => {
    console.log("listening");
})

