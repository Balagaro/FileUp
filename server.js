
try{
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
    sql= "CREATE TABLE rendeles (id INT(11) NOT NULL AUTO_INCREMENT,client_id VARCHAR(25),prog INT(11) NOT NULL, PRIMARY KEY (id),ar INT(11) NOT NULL, UNIQUE KEY client (client_id))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("Number of records deleted: " + result.affectedRows);
    });
    sql= "DROP TABLE IF EXISTS ordered";
    con.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("Number of records deleted: " + result.affectedRows);
    });
    //sql= "CREATE TABLE rendeles (id INT(11) NOT NULL AUTO_INCREMENT,client_id VARCHAR(25),prog INT(11) NOT NULL,ar INT(11) NOT NULL, PRIMARY KEY (id), UNIQUE KEY client (client_id))";
    sql=`CREATE TABLE ordered (
        order_id int(11) NOT NULL AUTO_INCREMENT,
        sorszam int(11) NOT NULL,
        ids varchar(500) NOT NULL,
        vari varchar(500) NOT NULL ,
        PRIMARY KEY (order_id),
        KEY sorszam (sorszam)
)`
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
    //console.log("Number of records inserted: " + result.affectedRows);
});
*/
//select
/*
sql="SELECT name, address FROM customers"
con.query(sql, function (err, result, fields) {
    if (err) throw err;
    //console.log(result);
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
app.post('/customise', (req, res) => {
    //console.log("req.body")
    let clientid=generateShortID()
    let ids=req.body.id
    let price=req.body.price
    let db=req.body.cartdb
    if (Array.isArray(ids)){
        ids = ids.map(function (x) {
            return parseInt(x, 10);
        });

        db = db.map(function (x) {
            return parseInt(x, 10);});
    }
    console.log(ids)
    console.log(db)
    let current,curres;
    let insert=[];
    res.render('custom', {id:ids, dbok:db, clientid:clientid, price:price})


/*
    let bebox="";
    let addbox="";
    let curres, vartypes;
    for (l=0;l<ids.length;l++){
        sql=`SELECT * FROM variations,tetelek where variations.tetel_id=tetelek.id and tetel_id=${con.escape(ids[l])}`
        con.query(sql, function (err, result, fields) {
            vartypes={}
            if (result.length>0){
            //console.log(result[0].megnev)
            addbox=`
            <div>
            <div><img  src="./sutik/${result[0].picture}" alt=""></div>
            <div>${result[0].megnev}</div>
            </div>
            <div>
            `

            for (s=0;s<result.length;s++){
                curres=result[s]
                //console.log(curres)
                addbox+=`
                <div>

                </div>
                `
            }
            addbox+="</div>"
            //console.log(addbox)
            bebox+=addbox
            }});

    }
    res.send(bebox)*/

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
    res.render('rendeles', { clientid:"", majom:"Önnek nincsen aktív rendelése."});
});

app.post('/rendeles', (req, res) => {
    let client_id=req.body.clientid
    let price=req.body.price
    price=parseInt(price.slice(0, -2))
    console.log(client_id)
    console.log(req.body)
    let sorszam, clientid;
    sql=`SELECT * FROM rendeles WHERE rendeles.client_id="${client_id}"`
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        //console.log(result);
        if (result.length!==0){
            sorszam=result[0].id
            clientid=result[0].client_id
            //console.log(sorszam)
            res.render('rendeles', {clientid:client_id, majom:sorszam});
        } else{
            sql = `INSERT INTO rendeles(client_id, prog,ar) VALUES ("${client_id}",0,${con.escape(price)})`
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            sql=`SELECT * FROM rendeles WHERE rendeles.client_id="${client_id}"`
            con.query(sql, function (err, result, fields) {
                if (err) throw err;
                //console.log('res1')
                //console.log(result);
                //console.log('res2')

                sorszam=result[0].id
                clientid=result[0].client_id
                //console.log(sorszam)
                res.render('rendeles', {clientid:client_id, majom:sorszam,price:price});
                //console.log(req.body.vari)
                let posted=req.body
                //console.log(sorszam)
                //console.log(posted['tetel'])
                if (posted['tetel']!==undefined){
                    if (posted['vari']===undefined){
                        sql = `INSERT INTO ordered(sorszam, ids, vari) VALUES (${con.escape(sorszam)},'${(posted['tetel'])}','')`
                    } else{
                        sql = `INSERT INTO ordered(sorszam, ids, vari) VALUES (${con.escape(sorszam)},'${(posted['tetel'])}','${(posted['vari'])}')`
                    }

                    con.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                }
                //let date_ob = new Date();
                //console.log(date_ob.getHours()+":"+date_ob.getMinutes()+":"+date_ob.getSeconds() )
                /*sql = `INSERT INTO ordered(sorszam, ids, dbs) VALUES (${con.escape(sorszam)},${con.escape(posted['tetel'])},${con.escape(posted['vari'])})`
                con.query(sql, function (err, result) {
                    if (err) throw err;
                });*/

            });

                    


        }

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
    //console.log(ipAddress)
    //console.log(proxie)
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
    //console.log(ipAddress)
    //console.log(proxie)
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
        //console.log('admin-joined')
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
    socket.on('elkeszult-neger', function (id){
       // //console.log('naja')
        //console.log(id)
        socket.in(id).emit('gyeremacig',id)
        var sql = `DELETE FROM ordered , rendeles USING ordered , rendeles  where ordered.sorszam=rendeles.id and rendeles.client_id=${con.escape(id)}`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            //console.log("Number of records deleted: " + result.affectedRows);
        });
    })
    socket.on('utonazuzenet', function (titok){
        //console.log('proba')
        socket.join(titok)
        //console.log(titok)
        sql=`SELECT * FROM rendeles,ordered WHERE rendeles.id=ordered.sorszam and rendeles.client_id=${con.escape(titok)}`
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            //console.log(result)
            if (result.length===0){
                socket.in('admin').emit('titkosuzenet', result[0])

            }else{
            socket.in('admin').emit('titkosuzenet', result[0])
            let idk=result[0]['ids']
            let varis=result[0]['vari']
            idk=idk.split(',');
            varis=varis.split(',');
            let osszerakas=[]
            let varrakas=[]
            for (e=0;e<idk.length;e++){
                let curid=idk[e].split('_')
                curid=curid.map(function (x) {
                    return parseInt(x, 10);
                });
                //console.log(curid)
                sql=`SELECT tetelek.picture megnev FROM tetelek WHERE tetelek.id=${con.escape(curid[0])}`
                con.query(sql, function (err, results, fields) {
                    if (err) throw err;
                    osszerakas.push([`${results[0]['megnev']}`,curid[1]])
                });
             }
            setTimeout(function () {
                socket.in('admin').emit('tibike',[osszerakas, titok])
            },500);

            for (b=0;b<varis.length;b++){
                let curdb=varis[b].split('_')
                console.log(curdb)
                curdb=curdb.map(function (x) {
                    return parseInt(x, 10);
                });
                if (curdb.length===0 || curdb[0]==="NaN"){
                    sql=`SELECT variations.type, tetelek.id, tetelek.megnev, variations.tetel_id, variations.value, variations.variation_id, tetelek.picture FROM variations,tetelek WHERE variations.tetel_id=tetelek.id`
                    con.query(sql, function (err, results, fields) {
                        if (err) throw err;
                        varrakas.push([results,curdb[1]])
                    });
                } else{
                    try{
                    //console.log(curid)
                    sql=`SELECT variations.type, tetelek.id, tetelek.megnev, variations.tetel_id, variations.value, variations.variation_id, tetelek.picture FROM variations,tetelek WHERE variations.tetel_id=tetelek.id and variations.variation_id=${con.escape(curdb[0])}`
                    con.query(sql, function (err, results, fields) {
                        if (err) throw err;
                        varrakas.push([results,curdb[1]])
                    });}catch(error){
                        sql=`SELECT variations.type, tetelek.id, tetelek.megnev, variations.tetel_id, variations.value, variations.variation_id, tetelek.picture FROM variations,tetelek WHERE variations.tetel_id=tetelek.id`
                        con.query(sql, function (err, results, fields) {
                            if (err) throw err;
                            varrakas.push([results,curdb[1]])
                        });
                    }
                }
            }
            setTimeout(function () {
                socket.in('admin').emit('minem',[varrakas, titok])
            },500);


        }});


    })
    socket.on('req-var', function (ins){
        let ids=ins[0];
        let dbok=ins[1];
        let curid,curdb,sql2;

        console.log(ins)
        for (k=0;k<ids.length;k++){
            curid=ids[k]
            curdb=dbok[k]
            let sql_1=[`SELECT ${curdb} db,variations.type,variations.tetel_id, tetelek.megnev, tetelek.picture FROM variations,tetelek where variations.tetel_id=tetelek.id and tetel_id=${con.escape(curid)} GROUP by variations.type`,curid]

            con.query(sql_1[0], function (err, result, fields) {
                console.log(result, "sima", sql_1)
                if (result.length===0){
                    sql2=`SELECT ${curdb} db, tetelek.megnev, tetelek.id tetel_id, tetelek.picture FROM tetelek where tetelek.id=${con.escape(sql_1[1])}`
                    console.log(sql2, "2.sql")
                    con.query(sql2, function (err, resultok, fields) {
                        console.log(resultok, "fortnite", sql_1[1])
                        socket.emit('requed-var',[0,resultok])
                    })
                }else{
                    socket.emit('requed-var',[0,result])

                for (j=0;j<result.length;j++){
                    //console.log(result[j]["type"])
                    sql=`SELECT ${con.escape(result[j]["db"])} db, tetelek.megnev, tetelek.picture, variations.variation_id, variations.tetel_id, variations.type, variations.value FROM variations,tetelek where variations.tetel_id=tetelek.id and tetel_id=${con.escape(result[j]["tetel_id"])} and variations.type=${con.escape(result[j]["type"])}`
                    //console.log(sql)
                    con.query(sql, function (err, results, fields) {
                        //console.log(results)
                        socket.emit('requed-var',[1,results])
                    })
                }

                }
                /*if (result.length===0){
                    sql=`SELECT ${curdb} db, tetelek.megnev, tetelek.picture FROM tetelek where tetel_id=${con.escape(ids[k])}`
                    con.query(sql, function (err, resultok, fields) {
                        //console.log(resultok,3232)
                        //socket.emit('requed-var',[-1,result])
                    })

                }else{
                socket.emit('requed-var',[0,result])}

                for (j=0;j<result.length;j++){
                    //console.log(result[j]["type"])
                    sql=`SELECT ${con.escape(result[j]["db"])} db, tetelek.megnev, tetelek.picture, variations.variation_id, variations.tetel_id, variations.type, variations.value FROM variations,tetelek where variations.tetel_id=tetelek.id and tetel_id=${con.escape(result[j]["tetel_id"])} and variations.type=${con.escape(result[j]["type"])}`
                    //console.log(sql)
                    con.query(sql, function (err, results, fields) {
                        //console.log(results)
                        socket.emit('requed-var',[1,results])
                    })
                }*/

            })

        }
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
            socket.emit("all-variations-queried",result)
            //console.log(result.length)
        });
    })
    socket.on('adide', function (asd){
        sql=`SELECT * FROM rendeles,ordered WHERE rendeles.id=ordered.sorszam`

        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            //console.log(result)
            for (a=0;a<result.length;a++){
                let titok=result[a]['client_id']
                //console.log(result[a]['client_id'])
                socket.emit('titkosuzenet', result[a])
                let idk=result[a]['ids']
                let varis=result[a]['vari']
                idk=idk.split(',');
                varis=varis.split(',');
                let osszerakas=[]
                let varrakas=[]
                for (e=0;e<idk.length;e++){
                    let curid=idk[e].split('_')

                    curid=curid.map(function (x) {
                        return parseInt(x, 10);
                    });
                    //console.log(curid)
                    sql=`SELECT tetelek.picture megnev FROM tetelek WHERE tetelek.id=${con.escape(curid[0])}`
                    con.query(sql, function (err, results, fields) {
                        if (err) throw err;
                        osszerakas.push([`${results[0]['megnev']}`,curid[1]])
                    });
                }
                setTimeout(function () {
                    socket.emit('tibike',[osszerakas, titok])
                },500);

                for (b=0;b<varis.length;b++){

                    let curdb=varis[b].split('_')
                    console.log(curdb)
                    curdb=curdb.map(function (x) {
                        return parseInt(x, 10);
                    });
                    if (curdb.length===0 || curdb[0]==="NaN"){
                        try{
                            //console.log(curid)
                            sql=`SELECT variations.type, tetelek.id, tetelek.megnev, variations.tetel_id, variations.value, variations.variation_id, tetelek.picture FROM variations,tetelek WHERE variations.tetel_id=tetelek.id and variations.variation_id=${con.escape(curdb[0])}`
                            con.query(sql, function (err, results, fields) {
                                if (err) throw err;
                                varrakas.push([results,curdb[1]])
                            });}catch(error){
                            sql=`SELECT variations.type, tetelek.id, tetelek.megnev, variations.tetel_id, variations.value, variations.variation_id, tetelek.picture FROM variations,tetelek WHERE variations.tetel_id=tetelek.id`
                            con.query(sql, function (err, results, fields) {
                                if (err) throw err;
                                varrakas.push([results,curdb[1]])
                            });
                        }}
                }
                setTimeout(function () {
                    socket.emit('minem',[varrakas, titok])
                },500);
            }
                //socket.emit("adomam",result)
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
            //console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+datas.ip+" joined with code: "+data.uid)
        } else {
            //console.log(id)
            //console.log(datas.lcode)
            //console.log(datas.scode)
            socket.emit("hotline","404")
            //console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+datas.ip+" connection denied")
        }
    });
    socket.on("receiver-join", function(data){
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init",data.uid);
        //console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+"receiver joined with id: "+data.sender_uid+" from ip: "+datas.ip)
    });

    socket.on("password", function (data){
        //console.log(data.uid)
        socket.in(data.uid).emit("out_passw", data.holdon)
        if (data.holdon===1){
            socket.join(data.joinuid);
            socket.in(data.uid).emit("init",data.joinuid);
        }
    });
    socket.on("reveive-joined", function(data){
        socket.in(data.uid).emit("rev-joined",data.uid)
        //console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+"revive joined with id: "+data.uid+" from ip: "+datas.ip)
    });
    socket.on("file-meta", function(data){
        socket.in(data.uid).emit("fs-meta",data.metadata);
        //console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+datas.ip+" sent metadata of "+data.metadata.filename+" size: "+data.metadata.buffer_size);
    });
    socket.on("fs-start", function(data){
        socket.in(data.uid).emit("fs-share",data);
    });
    socket.on("file-raw", function(data){
        socket.in(data.uid).emit("fs-share",data);
    });
    socket.on("file-ready", function(data){
        //console.log(moment().format("MM/DD/YYYY HH:mm:ss")+" "+data.uid+" finished the fileshare "+data.name);
    });
})
*/
httpServer.listen(80);
httpsServer.listen(443);
console.log("SziaSzilard")}
catch (error){
    //console.log(error)
}