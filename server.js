var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport')

var flash = require('connect-flash');
var mysql = require('mysql');

var port = process.env.PORT || 3000;

var http = require('http');
var app = express();

// configuration ================================================


require('./config/passport')(app, passport);


app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'public/js/vendor')));

app.use(cookieParser());
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'session secret key',
	secure: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app, passport);


http.createServer(app, function (req, res) {
	console.log(req.ip + 'was connected!');
}).listen(port, function(req, res) {
	console.log('Port ' + port + ' is listening'); });
