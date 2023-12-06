const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);


app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
    socket.on("sender-join", function(data){
        socket.join(data.uid);
        console.log("meta1")
    });
    socket.on("receiver-join", function(data){
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init",data.uid);
        console.log("meta2")
    });
    socket.on("file-meta", function(data){
        socket.in(data.uid).emit("fs-meta",data.metadata);
        console.log("meta3")
    });
    socket.on("fs-start", function(data){
        socket.in(data.uid).emit("fs-share",{});
        console.log("meta4")
    });
    socket.on("file-raw", function(data){
        socket.in(data.uid).emit("fs-share",data.buffer);
        console.log("meta5")
    });


})

server.listen(80);
console.log("SziaSzilard")