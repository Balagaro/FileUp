const http = require('http');
const fs = require('fs');
const express=require('express')
const path = require('path')

const app=express()
app.use(express.static(__dirname+'/FRONTEND_DEMO'));

app.get('/', function (req, res){
    res.sendFile(path.join('index.html'))
});
app.listen(8080)
console.log('fasza')