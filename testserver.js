const express = require("express");
const path = require("path");
const JSZip=require('jszip');
const FileSaver =require('file-saver');
const app = express();
const server = require("http").createServer(app);
const vhost=require('vhost')
const io = require("socket.io")(server);
const app1 = express.Router()
const app2 = express.Router()

app1.use((req, res, next) => {
    const ipAddress = req.socket.remoteAddress;
    next();
});
app1.use('/', express.static(path.join(__dirname+"/public")))

app2.use((req, res, next) => {
    const ipAddress = req.socket.remoteAddress;
    next();
});
app2.use('/', express.static(path.join(__dirname+"/public/mobile")))

app.use(vhost('localhost', app1))
app.use(vhost('192.168.0.108', app2))

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

server.listen(80);
console.log("SziaSzilard")