const express = require("express");
const path = require("path");
const JSZip=require('jszip');
const FileSaver =require('file-saver');
const app = express();
const fs = require("fs");
const https = require('https');
const server = require("http");
const vhost=require('vhost')



const options = {
    key: fs.readFileSync(`./ssl/www.fileup.site.key`),
    cert: fs.readFileSync(`./ssl/www.fileup.site.crt`)
};

const httpsServer = https.createServer(options, app);

const httpServer = server.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
});



const io = require("socket.io")(httpsServer);

app.get('/', function(req, res){
    res.sendFile(__dirname +"/public/docs/sziaszilard.png");
    // save html files in the `views` folder...
});

app.use(express.static(__dirname + '/public'))



app.get('/main', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/m/', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/mobile/index.html");
});

app.get('/send', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/send.html");
});

app.get('/receive', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/receive.html");
});

app.get('/m/send', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/mobile/receive.html");
});

app.get('/m/receive', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/mobile/receive.html");
});


io.on("connection", function(socket){
    socket.on("sender-join", function(data){
        socket.join(data.uid);
    });
    socket.on("receiver-join", function(data){
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init",data.uid);
    });
    socket.on("niggas", function (data){
        console.log(data)
    });
    socket.on("reveive-joined", function(data){
        socket.in(data.uid).emit("rev-joined",data.uid)
    });
    socket.on("file-meta", function(data){
        socket.in(data.uid).emit("fs-meta",data.metadata);
    });
    socket.on("fs-start", function(data){
        socket.in(data.uid).emit("fs-share",{});
    });
    socket.on("file-raw", function(data){
        socket.in(data.uid).emit("fs-share",[data.buffer, data.metadata]);
    });
})





/*
const httpsServer = https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('SZERETLEK TEAM HYPE');
});*/



httpServer.listen(80);
httpsServer.listen(443);

console.log("SziaSzilard")