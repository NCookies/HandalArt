

var index = require('./routes/index');
var bucket = require('./routes/bucket');
var mandal = require('./routes/mandal');
var calendar = require('./routes/calendar');
var register = require('./routes/register');

var path = require('path');
var fs = require('fs');


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


module.exports = function(app, passport) {

	
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
    });

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: '/',
        failureRedirect: '/' }));


    // =====================================
	// HOME PAGE (with login) ==============
	// =====================================
    app.get('/', index.routeHasId);


    app.post('/auth/login',
        passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
        function(req, res) {
        //'아이디나 비밀번호가 바르지 않습니다.'
        /*console.log('login post');*/

        res.redirect('/');
        //res.redirect('/login_success');
    });


    /*app.get('/login_success', ensureAuthenticated, function(req, res) {
        console.log("get login_success");
        res.redirect('/' + req.session.passport.user.id);
    });*/

    app.get('/register', register.regeist);


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
    .post(isLoggedIn, calendar.dayCalendarGetData)


    app.route('/calendar/day')
    .get(isLoggedIn, calendar.dayCalendar)
    .post(isLoggedIn, calendar.dayCalendarGetData);



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

};

