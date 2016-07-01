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

exports.CalendarGetData = function(req, res) {

    

    pool.getConnection(function(err, connection) {
        var events = JSON.parse(JSON.stringify(req.body)); 

        for (var i in events) {
            console.log("events : " + events[i]);
        }
        /*for (var i = 0; i < events.length; i++) {
            connection.query("INSERT INTO calendar VALUES (?, ?, ?, ?, ?, ?) "
            + "ON DUPLICATE KEY UPDATE member_AuthId = ?, calendar_Id = ?, calendar_Start = ?, "
            + "calendar_End = ?, calendar_Title = ?, calendar_AllDay = ?", 
            [], function(err, rows) {

            });
        }    */
    });

    res.render('fullcalendar');
}
