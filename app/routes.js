

var index = require('./routes/index');
var bucket = require('./routes/bucket');
var mandal = require('./routes/mandal');
var calendar = require('./routes/calendar');
var register = require('./routes/register');

var path = require('path');
var fs = require('fs');

var flash = require('connect-flash');


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

var getIPAddress = function(req, res, next) {
    var interfaces = require('os').networkInterfaces();

	for (var devName in interfaces) {

		var iface = interfaces[devName];
		for (var i = 0; i < iface.length; i++) {

			var alias = iface[i];

			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
				console.log("[Running IP Address] : " + alias.address);
                return next();
			}
	}

	console.log("[Running IP Address] : 0.0.0.0");
    return next();
}


module.exports = function(app, passport) {

    var getIPAddress = function(req, res, next) {
        var interfaces = require('os').networkInterfaces();

        for (var devName in interfaces) {

            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {

                var alias = iface[i];

                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                    console.log("[Running IP Address] : " + alias.address);
                    //next();
                }
        }

        next();
    }

    //app.use('/', getIPAddress);
	
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email'}));


    app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));


    app.get('/auth/twitter', passport.authenticate('twitter'));


    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            var user = JSON.stringify(req.user);
            var account = req.account;
            
            // Associate the Facebook account with the logged-in user.

            res.redirect('/');
        });

    app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    },
    function(err,req,res,next) {
        res.redirect('/auth/facebook/');

        if (err) {
            res.status(500);
            res.render('error', {message : err.message});
        }
    });

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: '/',
        failureRedirect: '/' }));


    // =====================================
	// HOME PAGE (with login) ==============
	// =====================================
    app.get('/', index.routeHasId);


    app.post('/auth/login',
        passport.authenticate('local', 
        { 
            failureRedirect: '/',
            failureFlash: true 
        }),
        function(req, res) {
        req.session.save(function() {
            res.redirect('/');
        });
    });

    app.post('/auth/regist', register.regeist);
    // 왜 POST 요청이 두 번이나 들어올까?


    app.get('/logout', function(req, res) {
        console.log('logout');
        req.logout();
        res.redirect('/');
    });
    


    // bucketlist
    app.route('/bucket')
    .get(isLoggedIn, bucket.bucketInit)
    //.post(bucket);

    // mandal_art
    app.get('/mandal', isLoggedIn, mandal.makeMandal);


    app.route('/mandal/main')
    .get(isLoggedIn, mandal.makeNewMandal)
    .post(isLoggedIn, mandal.getData);


    app.route('/mandal/main/:id')
    .get(isLoggedIn, mandal.mainMandal)
    .post(isLoggedIn, mandal.getData);


    // calendar
    app.route('/calendar')
    .get(isLoggedIn, calendar.fullCalendar)
    .post(isLoggedIn, calendar.CalendarGetData);

    app.post('/calendar/remove', calendar.removeEvents);
    


    /*app.route('/calendar/day')
    .get(isLoggedIn, calendar.dayCalendar)
    .post(isLoggedIn, calendar.dayCalendarGetData);*/



    // =====================================
	// LINK IMAGES =========================
	// =====================================
    app.get('/imgs/logo', function(req, res) {
        fs.readFile('public/imgs/logo.png', function(err, data) {
            res.writeHead(200, { 'Content-Type' : 'text/html' });
            res.end(data);
        });
    });


    app.get('/imgs/bucket', function(req, res) {
        fs.readFile('public/imgs/bucket_icon.png', function(err, data) {
            res.writeHead(200, { 'Content-Type' : 'text/html' });
            res.end(data);
        });
    });


    app.get('/imgs/calendar', function(req, res) {
        fs.readFile('public/imgs/calendar_icon.png', function(err, data) {
            res.writeHead(200, { 'Content-Type' : 'text/html' });
            res.end(data);
        });
    });


    app.get('/imgs/mandal', function(req, res) {
        fs.readFile('public/imgs/mandal_icon.png', function(err, data) {
            res.writeHead(200, { 'Content-Type' : 'text/html' });
            res.end(data);
        });
    });


    // =====================================
    // ERROR HANDLER =======================
    // =====================================

    app.use(function(req, res, next){
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('404', { url: req.url });
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');
    });
    
    app.use(function(err, req, res, next){
        res.status(err.status || 500);
        res.render('500', { error: err });
    });

};

