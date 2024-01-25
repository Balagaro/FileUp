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

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');

const io = require("socket.io")(httpsServer);

app.get('/', function(req, res){
    res.sendFile(__dirname +"/public/docs/sziaszilard.png");
    // save html files in the `views` folder...
});

let datas={};
app.use(express.static(__dirname + '/public'))

function generateID() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 25) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function generateShortID() {
    let shortresult = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 5) {
        shortresult += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return shortresult;

}





app.get('/main', function(req, res){
    const ipAddress = req.socket.remoteAddress;
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/m/', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/mobile/index.html");
});

app.get('/send', function(req, res){
    const ipAddress = req.socket.remoteAddress;
    let shortcode=generateShortID();
    let longcode =generateID();
    datas.lcode=longcode;
    datas.scode=shortcode;
    datas.ip=ipAddress;
    // save html files in the `views` folder...
    /*res.sendFile(__dirname + "/public/send.html");*/
    res.render('send', {longcode: longcode, shortcode: shortcode});
});

app.get('/receive', function(req, res){
    const ipAddress = req.socket.remoteAddress;
    datas.ip=ipAddress;
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
        id=data.uid
        if (id===datas.lcode || id===datas.scode){
            socket.join(data.uid);
            console.log(datas.ip+" joined with code: "+datas.lcode)
        } else {
            socket.emit("hotline","404")
            console.log(datas.ip+" connection denied")
        }
    });
    socket.on("receiver-join", function(data){
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init",data.uid);
        console.log("receiver joined with id: "+data.sender_uid+" from ip: "+datas.ip)
    });
    socket.on("cigi", function (data){
        console.log(data)
    });
    socket.on("reveive-joined", function(data){
        socket.in(data.uid).emit("rev-joined",data.uid)
        console.log("revive joined with id: "+data.uid+" from ip: "+datas.ip)
    });
    socket.on("file-meta", function(data){
        socket.in(data.uid).emit("fs-meta",data.metadata);
        console.log("metadata on the way"+datas.ip);
    });
    socket.on("fs-start", function(data){
        socket.in(data.uid).emit("fs-share",{});
    });
    socket.on("file-raw", function(data){
        socket.in(data.uid).emit("fs-share",[data.buffer, data.metadata]);
    });
    socket.on("file-ready", function(data){
        console.log(data);
    });
})



httpServer.listen(80);
httpsServer.listen(443);

console.log("SziaSzilard")