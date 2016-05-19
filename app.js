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
	
	var ejsObj = {
		FinalTarget : '최종목표',
			SubTarget1 : '세부목표1',
				Sub1_act1 : '실천사항1',
				Sub1_act2 : '실천사항2',
				Sub1_act3 : '실천사항3',
				Sub1_act4 : '실천사항4',
				Sub1_act5 : '실천사항5',
				Sub1_act6 : '실천사항6',
				Sub1_act7 : '실천사항7',
				Sub1_act8 : '실천사항8',
			SubTarget2 : '세부목표2',
			SubTarget3 : '세부목표3',
			SubTarget4 : '세부목표4',
			SubTarget5 : '세부목표5',
			SubTarget6 : '세부목표6',
			SubTarget7 : '세부목표7',
			SubTarget8 : '세부목표8',
	}
	res.render('mandal_main', {obj : ejsObj});
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
