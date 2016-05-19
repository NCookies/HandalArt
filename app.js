var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');


var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);


// uncomment after placing your favicon in /public

app.use('/vendor', express.static(path.join(__dirname, 'public/js/vendor')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/

http.createServer(app, function (req, res) {
	console.log(req.ip + 'was connected!');
}).listen(3000, function(req, res) {
	console.log('Port 3000 is listening');
});


// GET
app.get('/', function(req, res) {
	res.render('index');
});
// root URL

app.get('/login', function(req, res) {
	res.render('login');
});
// /mandal URL, render mandalart_main.html file

// bucketlist
app.get('/bucket', function(req, res) {
	res.render('bucket_list', {
		
	});
});

// calendar
app.get('/calendar', function(req, res) {
	res.render('fullcalendar');
});

// mandal_art
app.get('/mandal', function(req, res) {
	res.render('mandal_make');
});

app.get('/mandal/main', function(req, res) {
	/*var roominfo = function(roomname){
		this.roomname=roomname;
	};

	room_info_array= new Array(1);
	room_info_array[0]=new roominfo("room");*/
	
	var subTargets = 
		[{
			"id" : "act1_1",
			"article" : "세부목표1"
		}, 
		{
			"id" : "act1_2",
			"article" : "세부목표2"
		},
		{
			"id" : "act1_3",
			"article" : "세부목표3"
		},
		{
			"id" : "act1_4",
			"article" : "세부목표4"
		},
		{
			"id" : "act1_5",
			"article" : "세부목표5"
		},
		{
			"id" : "act1_6",
			"article" : "세부목표6"
		},
		{
			"id" : "act1_7",
			"article" : "세부목표7"
		},
		{
			"id" : "act1_8",
			"article" : "세부목표8"
		}]
	

	var actions = 
		[{
			"id" : "act1_1",
			"article" : "실천사항1"
		}, 
		{
			"id" : "act1_2",
			"article" : "실천사항2"
		},
		{
			"id" : "act1_3",
			"article" : "실천사항3"
		},
		{
			"id" : "act1_4",
			"article" : "실천사항4"
		},
		{
			"id" : "act1_5",
			"article" : "실천사항5"
		},
		{
			"id" : "act1_6",
			"article" : "실천사항6"
		},
		{
			"id" : "act1_7",
			"article" : "실천사항7"
		},
		{
			"id" : "act1_8",
			"article" : "실천사항8"
		},
		{
			"id" : "act2_1",
			"article" : "실천사항1"
		}, 
		{
			"id" : "act2_2",
			"article" : "실천사항2"
		},
		{
			"id" : "act2_3",
			"article" : "실천사항3"
		},
		{
			"id" : "act2_4",
			"article" : "실천사항4"
		},
		{
			"id" : "act2_5",
			"article" : "실천사항5"
		},
		{
			"id" : "act2_6",
			"article" : "실천사항6"
		},
		{
			"id" : "act2_7",
			"article" : "실천사항7"
		},
		{
			"id" : "act2_8",
			"article" : "실천사항8"
		}]
		
	var jsonObj = {
		FinalTarget : "최종목표",
		subTargets : subTargets,
		actions : actions
	}
 	
	res.render('mandal_main', {jsonObj : jsonObj});
});

app.get('/canvas', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/html/canvas_12clock.html'));
});


// images
app.get('/imgs/logo', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/imgs/logo.png'));
});

app.get('/imgs/bucket', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/imgs/bucket_icon.png'));
});

app.get('/imgs/calendar', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/imgs/calendar_icon.png'));
});

app.get('/imgs/mandal', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/imgs/mandal_icon.png'));
});

app.get('/imgs/login', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/imgs/login.png'));
});

module.exports = app;
