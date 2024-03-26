let lcodes=[];
const fs=require('fs')
//const asd=require('./public/js/checkcookies')
const express = require("express");
const path = require("path");
const JSZip=require('jszip');
const FileSaver =require('file-saver');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const server = require("http");
const vhost=require('vhost');
const moment = require("moment");
const options = {
    key: fs.readFileSync(`./ssl/www.fileup.site.key`),
    cert: fs.readFileSync(`./ssl/www.fileup.site.crt`)
};



let admincreds={user:"SutiVasar",pass:"j6GBetnW1yN1kKgF6FHAm3Lr70S2lx"}

let sql="";

var con = mysql.createConnection({
    host: "80.252.63.217",
    user: "SutiVasar",
    password: "j6GBetnW1yN1kKgF6FHAm3Lr70S2lx",
    database: "sutivasar"
});
/*var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "suti"
});

*/
con.connect(function(err) {
    if (err) throw err;
    console.log("Database connected!");
    sql= "DROP TABLE IF EXISTS rendeles";
    con.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("Number of records deleted: " + result.affectedRows);
    });
    sql= "CREATE TABLE rendeles (id INT(11) NOT NULL AUTO_INCREMENT,client_id VARCHAR(25),prog INT(11) NOT NULL, PRIMARY KEY (id), UNIQUE KEY client (client_id))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("Number of records deleted: " + result.affectedRows);
    });
});

//insert values
/*
sql = "INSERT INTO customers (name, address) VALUES ?";
let values = [
    ['John', 'Highway 71'],
    ['Peter', 'Lowstreet 4'],
    ['Amy', 'Apple st 652'],
    ['Hannah', 'Mountain 21'],
    ['Michael', 'Valley 345'],
    ['Sandy', 'Ocean blvd 2'],
    ['Betty', 'Green Grass 1'],
    ['Richard', 'Sky st 331'],
    ['Susan', 'One way 98'],
    ['Vicky', 'Yellow Garden 2'],
    ['Ben', 'Park Lane 38'],
    ['William', 'Central st 954'],
    ['Chuck', 'Main Road 989'],
    ['Viola', 'Sideway 1633']
];
con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
});
*/
//select
/*
sql="SELECT name, address FROM customers"
con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });


console.log(result[2].address);
 */


app.use(express.urlencoded({extended: true}));
app.use(express.json());

const httpsServer = https.createServer(options, app);
const httpServer = server.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
});
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
const io = require("socket.io")(httpsServer);
const {IP2Proxy} = require("ip2proxy-nodejs");

app.all('/admin/*', (req,res, next) =>{
    res.send("Nah-ah")
});
app.get('/cart', function(req, res){
    //res.sendFile(__dirname + "/public/index.html");
    res.render('cart', {id:generateShortID()});
});
app.post('/cart', (req, res) => {
    res.send('jojo')
    console.log(req.body)
    let ids=req.body.id
    ids = ids.map(function (x) {
        return parseInt(x, 10);
    });
    let db=req.body.id
    db = db.map(function (x) {
        return parseInt(x, 10);
    });
    console.log(ids)
    console.log(db)
    let bebox="";
    let addbox;
    for (l=0;l<ids.length;l++){
        sql=`SELECT * FROM variations,tetelek where variations.tetel_id=tetelek.id and tetel_id=${con.escape(ids[l])}`
        con.query(sql, function (err, result, fields) {
            console.log(result)

        });
    }

});
app.get('/admin', (req, res) => {
    res.render('login', {nono:0});
    //res.sendFile(__dirname + '/public/login.html');
});

app.post('/admin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if((username===admincreds.pass || username===admincreds.user) && password===admincreds.pass){
        res.render('admin/admin', {nono:password});
    } else {
        res.render('login', {nono: 1});
    }
});
app.get('/rendeles', (req, res) => {
    let clientid=generateShortID()
    console.log(clientid)
    res.render('rendeles', {clientid:clientid, majom:""});
    //res.sendFile(__dirname + '/public/login.html');
});

app.post('/rendeles', (req, res) => {
    let client_id=req.body.clientid
    let sorszam, clientid;
    sql = `INSERT INTO rendeles(client_id, prog) VALUES ("${client_id}",0)`
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
    sql=`SELECT * FROM rendeles WHERE rendeles.client_id="${client_id}"`
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        sorszam=result[0].id
        clientid=result[0].client_id
        console.log(sorszam)
        res.render('rendeles', {clientid:client_id, majom:sorszam});
    });

});
let ip2proxy = new IP2Proxy();
ip2proxy.open("./IP2PROXY-IP-PROXYTYPE-COUNTRY-REGION-CITY-ISP-DOMAIN-USAGETYPE-ASN-LASTSEEN-THREAT-RESIDENTIAL-PROVIDER.BIN");

app.get('/', function(req, res){
    //res.sendFile(__dirname + "/public/index.html");
    res.render('suti', {});
});



app.get('/fileup', function(req, res){
    let ipAddress = req.socket.remoteAddress
    ipAddress=ipAddress.slice(7)
    let all = ip2proxy.getAll(ipAddress);
    let proxie=all.isProxy;
    res.sendFile(__dirname + "/public/index.html");
    //console.log(ipAddress)
    //console.log(proxie)
/*
    if (proxie===1 || proxie===2){
        res.send("401 Error")
    }else{

        logger.info({ message: 'Hello World', labels: { 'env': 'test' } })
        res.sendFile(__dirname + "/public/index.html");

    }*/
});
let datas={};

app.use(express.static(__dirname + '/public'))

function generateID() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 50) {
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
    while (counter < 20) {
        shortresult += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return shortresult;
}
app.get('/maintenance', function(req, res){
    res.sendFile(__dirname +"/public/stop.html");
    // save html files in the `views` folder...
});
app.get('/m/', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/mobile/index.html");
});
let sent=0
app.get('/send', function(req, res){
    sent=1;
    let ipAddress = req.socket.remoteAddress;
    ipAddress=ipAddress.slice(7)
    let shortcode=generateShortID();
    let longcode =generateID();
    datas.lcode=longcode;
    datas.scode=shortcode;
    datas.ip=ipAddress;
    let all = ip2proxy.getAll(ipAddress);
    let proxie=all.isProxy;
    console.log(ipAddress)
    console.log(proxie)
    if (proxie===1 || proxie===2){
        res.send("401 Error")
    }else{
        res.render('send', {longcode: longcode, shortcode: shortcode});
    }
});
app.get('/receive', function(req, res){
    let ipAddress = req.socket.remoteAddress;
    ipAddress=ipAddress.slice(7)
    datas.ip=ipAddress;
    let all = ip2proxy.getAll(ipAddress);
    let proxie=all.isProxy;
    console.log(ipAddress)
    console.log(proxie)
    if (proxie===1 || proxie===2){
        res.send("401 Error")
    }else{
        res.render('receive', {});
    }
});
app.get('/m/send', function(req, res){
    let ipAddress = req.socket.remoteAddress;
    let shortcode=generateShortID();
    let longcode =generateID();
    datas.lcode=longcode;
    datas.scode=shortcode;
    datas.ip=ipAddress;
    // save html files in the `views` folder...
    /*res.sendFile(__dirname + "/public/send.html");*/
    res.render('mobile/send', {longcode: longcode, shortcode: shortcode});
});
app.get('/m/receive', function(req, res){

    // save html files in the `views` folder...
    res.sendFile(__dirname + "/public/mobile/receive.html");
});
app.get('/terms-and-cookies', function(req, res){
    res.sendFile(__dirname + "/public/data.html");
});
io.on("connection", function(socket){
    socket.on("admin-join", function(data){
        socket.join("admin");
    });
    socket.on("items-req", function(data){
        sql="SELECT * FROM tetelek"
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            socket.emit("item-query",result);
            //console.log(result)
        });
        sql="SELECT tetelek.id, tetelek.megnev, storage.darab, storage.ar, tetelek.picture, tetelek.type FROM storage, tetelek WHERE storage.id=tetelek.id"
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            socket.emit("storage-query",result);
            //console.log(result)
        });

    });
    socket.on('to-querry', function (id){
        sql=`SELECT * FROM storage WHERE storage.id=${con.escape(id)}`
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            socket.emit("admin-queried",{id:id, result:result});
            //console.log(result.length)
        });
    })
    socket.on('get-variations', function (id){
        sql=`SELECT * FROM variations WHERE variations.tetel_id=${con.escape(id)}`
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            socket.emit("variations-queried",{id:id, result:result});
            //console.log(result.length)
        });
    })
    socket.on('get-all-variations', function (admin){
        sql=`SELECT * FROM variations,tetelek where variations.tetel_id=tetelek.id`
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            if (admin==="admin"){
            socket.emit("all-variations-queried",result)}
            //console.log(result.length)
        });
    })
    socket.on('insert-variations', function (datas){

        sql=`INSERT INTO variations(tetel_id, type, value) VALUES (${con.escape(datas.id)},${con.escape(datas.typeval)},${con.escape(datas.valval)})`
        con.query(sql, function (err, result) {
            if (err) throw err;
            //console.log("Number of records inserted: " + result.affectedRows);
        });
    })
    socket.on('into-database', function (datas){
        sql=`INSERT INTO storage(id, darab, ar) VALUES (${con.escape(datas.id)},${con.escape(datas.count)},${con.escape(datas.price)})`
        con.query(sql, function (err, result) {
            if (err) throw err;
            //console.log("Number of records inserted: " + result.affectedRows);
        });
    })
    socket.on('mod-into-database', function (datas){
        if (datas.price==="delete" && datas.count==="delete"){
            sql=`DELETE FROM storage WHERE storage.id=${con.escape(datas.id)}`;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }else {
            //console.log('alma')
            //sql=`INSERT INTO storage(id, darab, ar) VALUES (${con.escape(datas[0])},${con.escape(datas[1])},${con.escape(datas[2])})`
            sql = `UPDATE storage SET ar='${con.escape(datas.price)}',darab='${con.escape(datas.count)}' WHERE storage.id=${con.escape(datas.id)}`
            con.query(sql, function (err, result) {
            if (err) throw err;
            //console.log(result.affectedRows + " record(s) updated");
        });}
    })
    socket.on('customer-join', function (){
            //console.log('alma')
            //sql=`INSERT INTO storage(id, darab, ar) VALUES (${con.escape(datas[0])},${con.escape(datas[1])},${con.escape(datas[2])})`
            sql=`UPDATE storage SET ar='${con.escape(datas.price)}',darab='${con.escape(datas.count)}' WHERE storage.id=${con.escape(datas.id)}`
            con.query(sql, function (err, result) {
                if (err) throw err;
                //console.log(result.affectedRows + " record(s) updated");
            });
        })


});

/*
io.on("connection", function(socket){
    socket.on("sender-join", function(data){
        id=data.uid
        if (id===datas.lcode || id===datas.scode){
            socket.join(data.uid);
            console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+datas.ip+" joined with code: "+data.uid)
        } else {
            console.log(id)
            console.log(datas.lcode)
            console.log(datas.scode)
            socket.emit("hotline","404")
            console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+datas.ip+" connection denied")
        }
    });
    socket.on("receiver-join", function(data){
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init",data.uid);
        console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+"receiver joined with id: "+data.sender_uid+" from ip: "+datas.ip)
    });

    socket.on("password", function (data){
        console.log(data.uid)
        socket.in(data.uid).emit("out_passw", data.holdon)
        if (data.holdon===1){
            socket.join(data.joinuid);
            socket.in(data.uid).emit("init",data.joinuid);
        }
    });
    socket.on("reveive-joined", function(data){
        socket.in(data.uid).emit("rev-joined",data.uid)
        console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+"revive joined with id: "+data.uid+" from ip: "+datas.ip)
    });
    socket.on("file-meta", function(data){
        socket.in(data.uid).emit("fs-meta",data.metadata);
        console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+datas.ip+" sent metadata of "+data.metadata.filename+" size: "+data.metadata.buffer_size);
    });
    socket.on("fs-start", function(data){
        socket.in(data.uid).emit("fs-share",data);
    });
    socket.on("file-raw", function(data){
        socket.in(data.uid).emit("fs-share",data);
    });
    socket.on("file-ready", function(data){
        console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+data.uid+" finished the fileshare "+data.name);
    });
})
*/
httpServer.listen(80);
httpsServer.listen(443);
console.log("SziaSzilard")