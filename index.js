const express = require("express")
require("dotenv").config("/.env")
const app = express()
const mysql = require("mysql2")
const port = process.env.PORT

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

db.connect((err) =>{
    if(err) {
        console.log(err, "MYSQL FAILED TO CONNECT")
    } else {
        console.log("MYSQL CONNECTED !!!!")
    }
})

app.use(express.json())



app.get("/users", (req, res) => {
    db.query("SELECT * FROM Users;", (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result)
        }
    })
})

app.post("/users", (req, res) => {
    const { username, email, password } = req.body
    db.query(
        "INSERT INTO Users (username, email, password) VALUES (?, ?, ?);",
        [username, email, password],
        (err, result) => {
            if(err) {
                res.status(400).json(err)
            } else {
                res.status(200).json(result)
                console.log(req.body)
            }
        }
    )
})

app.put("/users", (req, res) => {})

app.delete("/users/:id", (req, res) => {})

app.listen(port, () => console.log("server running on port " + port))