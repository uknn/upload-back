const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs');
const cookieSession = require("cookie-session");
// Connecting to db
mongoose
    .connect('mongodb://127.0.0.1:27017/image_db')
    .then((database) => {
        console.log(`Connected to: "${database.connections[0].name}"`);
    })
    .catch((err) => {
        console.error('Error connecting to mongo', err.reason);
    })

const imageRoute = require('../back/routes/image.route')
const app = express()
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
)

app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"],
}))
app.use(
    cookieSession({
        name: "photo-session",
        secret: "COOKIE_SECRET",
        httpOnly: true
    })
);
app.use(express.static(path.join(__dirname, 'dist/upload')))
app.use('/', express.static(path.join(__dirname, 'dist/upload')))
app.use('/api', imageRoute)

app.use((req, res, next) => {
    next(createError(404))
})
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
})

module.exports = app;