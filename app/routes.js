

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
	//res.redirect('/');
    res.render('index', { user : false, message : '로그인 후 이용해주세요.' });
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
        passport.authenticate('local', 
        { 
            failureRedirect: '/',
            //badRequestMessage : 'Missing username or password.', 
            failureFlash: true 
        }),
        function(req, res) {
        req.session.save(function(){
            res.redirect('/');
        });
    });


    app.get('/login_fail', function(req, res) {
        console.log('fck');
        res.render('index', { message: req.flash('아이디 또는 비밀번호가 잘못되었습니다') });
    });


    /*app.get('/login_success', ensureAuthenticated, function(req, res) {
        console.log("get login_success");
        res.redirect('/' + req.session.passport.user.id);
    });*/

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

    app.post('/calendar/day', calendar.dayCalendarGetData);

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

};

