const express = require('express');
const jwt = require('jsonwebtoken');

const PORT = 4000;
const app = express();
const secretKey = "secretkey";

app.get('/', (req, res) => {
    res.json({
        message: "A sample api"
    })
})

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        userName: "Sham",
        email: "sham@gmail.com"
    }

    jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
        res.json({
            token
        })
    })
})


app.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.send({
                result: "Invalid token"
            });
        } else {
            res.send({
                message: "Profile accessed",
                authData
            });
        }
    });
});


function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.send({
            result: "Token is not valid"
        })
    }
}


app.listen(PORT, () => {
    console.log("Server is running on", PORT);
})