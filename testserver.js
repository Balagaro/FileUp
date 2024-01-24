const express = require("express");
const path = require("path");
const JSZip=require('jszip');
const FileSaver =require('file-saver');
const app = express();
const fs = require("fs");
const https = require('https');
const server = require("http").createServer(app);
const vhost=require('vhost')
const io = require("socket.io")(server);



app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){

    // save html files in the `views` folder...
    res.sendfile(__dirname + "/public/index.html");
});


app.post('/', function(req, res){

    var code = req.body.code;
    console.log(code);

    res.sendFile( __dirname + "/public/index.html");
});
app.get('/m/', function(req, res){

    // save html files in the `views` folder...
    res.sendfile(__dirname + "/public/mobile/index.html");
});
app.post('/m/', function(req, res){

    var code = req.body.code;
    console.log(code);

    res.sendFile( __dirname + "/public/mobile/index.html");
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


server.listen(8000);

console.log("SziaSzilard")