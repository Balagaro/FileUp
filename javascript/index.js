
var io   = require('socket.io'),
    url  = require('url'),
    sys  = require('sys'),
    fs = require('fs'),
    express = require('express'),
    http=require('http');

var app = express();
var path = require('path')

app.use(express.static(path.join(__dirname, 'public')));
fs.readFile('./front.html', function (err, html) {

    if (err) throw err;

    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(5555)
    ;
});
