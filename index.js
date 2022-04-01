const express = require("express")
require("dotenv").config("/.env")
const app = express()
const mysql = require("mysql2")
const cors = require("cors")
const bodyparser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const bcrypt = require("bcrypt")
//const { response } = require("express")
const saltRounds = 10
const port = process.env.PORT

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())
app.use(bodyparser.urlencoded({ extended: true }))

app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}))

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


app.get("/users/login", (req, res) => {
    db.query("SELECT * FROM Users;", (err, result) => {
        if (err) {
            res.status(400).json(err)
        } else {
            res.status(200).json(result)
        }
    })
})

app.post("/users/signup", (req, res) => {
    const { username, email, password } = req.body

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err, "Something went wrong")
        } else {
            console
        }
        db.query(
            "INSERT INTO Users (username, email, password) VALUES (?, ?, ?);",
            [username, email, hash],
            (err, result) => {
                if(err) {
                    res.status(400).json(err)
                    console.log(err)
                } else {
                    res.status(200).json(result)
                    console.log("req.body", req.body)
                }
            }
        )
    })
    
})

app.post("/users/login", (req, res) => {
    const { email, password } = req.body

    db.query(
        "SELECT * FROM Users WHERE email = ?",
        email,
        (err, result) => {
            if(err) {
                res.send({ err: err })
            }
            if(result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result
                        console.log(req.session.user)
                        res.send(result)
                    } else {
                        res.send({ message: "Email or password invalid !"})
                    }
                })
            }
            else {
                res.send({ message: "User doesn't exist !" })
            }
        }
    )
})

app.put("/users", (req, res) => {})

app.delete("/users/:id", (req, res) => {})

app.listen(port, () => console.log("server running on port " + port))