const http = require('http');
const fs = require('fs');
const express = require('express')
const path = require('path')

const app = express()
app.use(express.static(__dirname + '/FRONTEND_DEMO'));

app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});
app.listen(3000)
console.log('hajra Szilard')