var mysql = require('mysql');

var pool = mysql.createPool({
    host :'localhost',
    port : 3306,
    user : 'root',
    password : 'mysqlhandalart3576!',
    database : 'handalart',
    connectionLimit : 20,
    waitForConnections : false
});

var async = require('async');


/* 어떤 사이트로 로그인 되어 있는지 확인(local, google 등) */
var getProvider = function(req) {
    var provider;

    console.log('[provider] : ' + req.session.passport.user.provider);

    if (req.session.passport.user.provider == undefined) {
        provider = "local:";
        console.log("provider is local");

        return provider;
    } else if(req.session.passport.user.provider == "local") {
        return "";
    }
    else {
        provider = req.session.passport.user.provider + ":";
        console.log("provider is " + provider.split(':')[0]);
    }

    return provider;
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


exports.dayCalendarGetData = function(req, res) {
    /*var tmp = JSON.stringify(req.body).replace("/'/g, ''");
    var arr = JSON.parse(tmp);*/

    

    /*console.log(arr.events);
    console.log("[0] : " + JSON.parse(arr.events)[0].id);
    console.log("[1] : " + arr.events[1]);*/

    //var arr = JSON.parse(arr.events);

    pool.getConnection(function(err, connection) {
        var provider = getProvider(req);
        var authId = provider + req.session.passport.user.id;

        console.log('[auth] : ' + authId);

        console.log("[day-calendar] : " + JSON.stringify(req.body));

        var tmp = JSON.parse(JSON.stringify(req.body));
        var arr = JSON.parse(tmp.events);
        
        console.log(arr);
        
        var events;
        var length = arr.length;
        var query = "INSERT INTO calendar VALUES (?, ?, ?, ?, ?, ?) "
            + "ON DUPLICATE KEY UPDATE member_AuthId = ?, calendar_Id = ?, calendar_Start = ?, "
            + "calendar_End = ?, calendar_Title = ?, calendar_AllDay = ?"

        for (var calendarIndex = 0; calendarIndex < length; calendarIndex++) {
            (function () {
                var calendar = calendarIndex;
                events = arr[calendar];

                connection.query(query,
                [authId, events.id, events.start, events.end, events.title, events.allDay,
                 authId, events.id, events.start, events.end, events.title, events.allDay],
                function(err, rows) {
                    if (err) {
                        console.log(err);
                        connection.release();
                        res.render('fullcalendar', { events : false });
                    }
                    console.log('day calendar insert success!!');
                });
            }());
        }

    });

    //res.redirect('/calendar');
    //res.render('fullcalendar', { events : false });
}


exports.fullCalendar = function(req, res) {
    pool.getConnection(function(err, connection) {
        var provider = getProvider(req);
        var authId = provider + req.session.passport.user.id;

        var query = 'SELECT calendar_Id, calendar_Start, calendar_End, calendar_Title, calendar_AllDay FROM calendar WHERE member_AuthId = ?';

        connection.query(query, [authId], function(err, rows) {
            if (err) {
                console.log(err);
                connection.release();
                res.render('fullcalendar', {events : false});
            }
            res.render('fullcalendar', {events : JSON.stringify(rows)});            
        });

        connection.release();
    });
}


exports.CalendarGetData = function(req, res) {

    pool.getConnection(function(err, connection) {
        var provider = getProvider(req);
        var authId = provider + req.session.passport.user.id;

        /*var temp = JSON.stringify(req.body)//.replace(/'/g, '').replace(/\\/g, "");
        var arr = JSON.parse(temp);

        console.log(arr);
        console.log(arr.events);
        console.log(arr.events[0].start);*/

        console.log('[provider] : ' + authId);

        console.log(JSON.stringify(req.body));

        var arr = 
        JSON.parse(JSON.stringify(req.body)
        .replace(/\\/g, "")
        .replace(/""/g, ''));
        
        console.log(arr);
        
        var events;
        var length = arr.events.length;
        var query = "INSERT INTO calendar VALUES (?, ?, ?, ?, ?, ?) "
            + "ON DUPLICATE KEY UPDATE member_AuthId = ?, calendar_Id = ?, calendar_Start = ?, "
            + "calendar_End = ?, calendar_Title = ?, calendar_AllDay = ?"

        for (var calendarIndex = 0; calendarIndex < length; calendarIndex++) {
            (function () {
                var calendar = calendarIndex;
                events = arr.events[calendar];

                connection.query(query,
                [authId, events.id, events.start, events.end, events.title, events.allday,
                 authId, events.id, events.start, events.end, events.title, events.allday],
                function(err, rows) {
                    if (err) {
                        console.log(err);
                        connection.release();
                        res.render('fullcalendar');
                    }
                });
            }());
        }

    });

    //res.render('fullcalendar', {events : false});
}


exports.removeEvents = function(req, res) {

    pool.getConnection(function(err, connection) {
        var provider = getProvider(req);
        var authId = provider + req.session.passport.user.id;

        var query = 'DELETE FROM calendar WHERE member_AuthId = ? AND calendar_Id = ?';

        var id = JSON.stringify(req.body).match(/\d+/)[0];
        console.log(authId);

        connection.query(query, [authId, id],
        function(err, rows) {
            if (err) {
                console.log(err);
                connection.release();
                res.render('fullcalendar');
            }
            console.log('delete calendar ' + id);
        });

        connection.release();
    });
}