var http = require("http");
var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));



http.createServer(app, function(req, res) {
	console.log("Connected!");
}).listen(3000);
//port is 3000

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/index.html'))
});
// root URL

app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/login.html'));
});
// /mandal URL, render mandalart_main.html file

// bucketlist
app.get('/bucket', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/bucket_list.html'));
});

// calendar
app.get('/calendar', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/calendar.html'));
});

// mandal_art
app.get('/mandal', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/mandal_make.html'));
});

app.get('/mandal/main', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/mandal_main.html'));
});

app.get('/mandal/table', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/mandal_table.html'));
});

app.get('/mandal/table/center', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/mandal_table_center.html'));
});
// /mandal/table URL, load table.html file from main.html


app.get('/canvas', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/canvas_12clock.html'));
});

app.get('/d3', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/d3_mouseoverout.html'));
});


// images
app.get('/imgs/logo', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/image/logo.png'));
});

app.get('/imgs/bucket', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/image/bucket_icon.png'));
});

app.get('/imgs/calendar', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/image/calendar_icon.png'));
});

app.get('/imgs/mandal', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/image/mandal_icon.png'));
});

app.get('/imgs/login', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/image/login.png'));
});
