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
/*
var asdasd = function(req, res, next) {
	express.static(path.join(__dirname+"/public"));
	  // ... perform some operations
	  next(); // Call next() so Express will call the next middleware function in the chain.
}

app1.use(express.static(path.join(__dirname+"/public")));
app2.use(express.static(path.join(__dirname+"/public/mobile")));*/

/*
app1.get('/', (req, res) => {
  const ipAddress = req.socket.remoteAddress;
   console.log(ipAddress);
	console.log("alma");
})*/

/*
// requests will never reach this route
app1.get('/', (req, res) => {
	const ipAddress = req.socket.remoteAddress;
    console.log(ipAddress);
	res.sendFile(path.join(__dirname, 'index.html'));

})
*/
/*

app1.use(express.static(path.join(__dirname+"/public/mobile")),function(req, res, next) {
    const ipAddress = req.socket.remoteAddress;
    console.log(ipAddress);
	next();
});*/

/*app.use(express.static(path.join(__dirname+"/public")), app1)*/

app.use(vhost('104.248.92.11', app1))
app.use(vhost('m.fileup.site', app2))

/*app.use(express.static(path.join(__dirname+"/public")));*/


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