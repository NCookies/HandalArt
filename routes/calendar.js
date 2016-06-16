var mysql = require('mysql');

var pool = mysql.createPool({
    host    :'localhost',
    port : 8080,
    user : 'root',
    password : 'mysqlhandalart3576',
    database:'handalart',
    connectionLimit:20,
    waitForConnections:false
});


exports.fullCalendar = function(req, res) {
    res.render('fullcalendar');
}

exports.fullCalendarGetData = function(req, res) {
    if (req.xhr || req.accepts('json, html')==='json') {
		console.log(JSON.stringify(req.body));
		// (에러가 있다면 { error: 'error description' }을 보냄)
	} else {
		res.redirect(303, '/');
		// (에러가 있다면 에러 페이지로 리다이렉트)
	}

    //res.render('day_calendar', { events : req.body });
}

exports.dayCalendar = function(req, res) {
    res.render('day_calendar');
}

exports.dayCalendarGetData = function(req, res) {
    console.log(req.body);

    res.render('day_calendar', { events : req.body });
}