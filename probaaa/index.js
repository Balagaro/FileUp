const express = require('express');
const path = require('path');
const fs = require("fs");
const http = require("http");
const app = express();
const server = require("http").createServer(app);
app.use(express.static(path.join(__dirname+"public")))
fs.readFile('./public/html.html', function (err, html) {

    if (err) throw err;

    http.createServer(function(request, response) {
        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
    }).listen(5555)
    ;
});
