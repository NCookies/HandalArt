var express = require('express');

var index = require('./routes/index');
var auth = require('./routes/auth');

var bucket = require('./routes/bucket');
var mandal = require('./routes/mandal');
var calendar = require('./routes/calendar');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var flash = require('connect-flash');

var mysql = require('mysql');

var http = require('http');
var app = express();

var connection = mysql.createConnection({
    host :'localhost',
    port : 3306,
    user : 'root',
    password : 'ehehgks!!123',
    database:'handalart'
});

var pool = mysql.createPool({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : 'ehehgks!!123',
    database:'handalart',
    connectionLimit:20,
    waitForConnections:false
});


connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

/*
insert into member_group values (1, "student", 2);

insert into member values ("jung", "qkqh", "TaeKyun", "jungjung@gmail.com", 1990213, 1);
insert into member values ("NCookie", "good", "SeungWoo", "swstar21c@gmail.com", 19990902, 1);

insert into bucketlist values ("jung", "bucket_1", "YET", "자바 프로젝트 완료", "20160627");
insert into mandal_ultimate values("jung", 1, "bucket_1", "Study!!");
*/
 
'use strict';

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'public/js/vendor')));

app.use(flash());

app.use(cookieParser());
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'keyboard cat'
}));

passport.use(new LocalStrategy({
        usernameField : 'email', // user email
        passwordField : 'password', // user password
        passReqToCallback : true
		// 인증을 수행하는 인증 함수, HTTP request를 그대로  전달할지 여부
    }, 
	function(req ,userid, password, done) {
		var account;

		pool.getConnection(function(err, connection) {
			connection.query("select * from member where member_Email = ?", [userid], function(err, rows) {
				if (err) {
					console.error(err);
					connection.rollback(function () {
						console.error('rollback error');
						throw err;
					});
				}

				account = JSON.parse(JSON.stringify(rows));

				if (account == null) {
					console.log("No Account");
					return done(null, false);
				}

				if (userid == rows[0].member_Email && password == rows[0].member_Password) {
					var user = { 'email': rows[0].member_Email, 'id': rows[0].member_Id };
					return done(null, user);
				} else {
					return done(null, false);
				}
			});

			connection.release();
		});	
    }
));

passport.use(new FacebookStrategy({
        clientID: '594228160736253',
        clientSecret: '1cd92a04f2aa948c175013002f00341e',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
		/*User.findOrCreate({ facebookId: profile.id }, function (err, user) {
			if (err) { return done(err); }
			return done(err, user);
		});*/
		console.log(profile.id);
		done(null, profile);
    }
));

/*passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));*/

passport.use(new GoogleStrategy({
    clientID: '947227472989-d2i27nlkn6la0gfdmlaocs2ah6aaa4tr.apps.googleusercontent.com',
    clientSecret: 'LDZUY-y4KPijlulViqLR7wlh',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       /*User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });*/
	   console.log(profile.id);
	   done(null, profile);
	}
));

passport.serializeUser(function(user, done) {
	// user : LocalStrategy 객체의 인증함수에서 done(null,user)에 의해 리턴된 값이 넘어옴
    console.log('serialize');
    done(null, user); // session에 저장할 정보
});
// 로그인에 성공하면 사용자 정보를 세션에 저장

passport.deserializeUser(function(user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize');   
    done(null, user);
    //});
});
// node.js의 모든 페이지에 접속할 때마다 호출, 사용자 정보를 세션에서 읽어옴

// 호출될 때마다 매번 사용자 id 또는 email을 이용하여 DB에서 추가로 정보를 가져옴
// 하지만 이 방식은 DB 접근이 너무 잦기 때문에 비추천
// 저장할 데이터가 너무 크지 않은 이상 사용자 로그인 데이타를 모두 serialize시에 session에 넣는 것을 권장
// 데이터가 너무 많으면 redis와 같은 외부 메모리 DB를 이용해서 저장


app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/login');
}




app.get('/', index.route);
// root URL


app.get('/login', function(req, res) {
	var account = req.user;
		
	if (typeof account == "undefined") {
		res.render('login', { user : false});
	} // 로그인 되어 있지 않을 때
	else {
		if (account.email) { // 사이트 자체 로그인
			res.render('logout', { user : req.session.passport.user.email });
		} else { // 외부 계정 연동
			res.render('logout', { user : req.session.passport.user.displayName || {} });			
		}
	} // 로그인 세션이 있을 때	
});


app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


app.get('/auth/facebook', passport.authenticate('facebook'));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));


app.get('/auth/twitter', passport.authenticate('twitter'));


app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
	function(req, res) {
		var user = JSON.stringify(req.user);
		var account = req.account;

		// Associate the Facebook account with the logged-in user.

		res.redirect('/');
	});
	
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  

app.get('/auth/twitter/callback',
passport.authenticate('twitter', { successRedirect: '/',
	failureRedirect: '/login' }));


// bucketlist
app.route('/bucket')
.get(bucket.bucketInit)
//.post(bucket);

// mandal_art
app.get('/mandal', mandal.makeMandal);


app.route('/mandal/main/:id')
.get(mandal.getData);

app.route('/mandal/main')
.get(mandal.mainMandal)
.post(mandal.getData);
	 
// calendar
app.route('/calendar')
.get(calendar.fullCalendar)
.post(calendar.dayCalendarGetData)


app.route('/calendar/day')
.get(calendar.dayCalendar)
.post(calendar.dayCalendarGetData);


app.post('/login',
		passport.authenticate('local', 
		{ failureRedirect: '/login', 
failureFlash: true }), 
		function(req, res) {
		//'아이디나 비밀번호가 바르지 않습니다.' 
	res.redirect('/');
});
// POST



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


http.createServer(app, function (req, res) {
	console.log(req.ip + 'was connected!');
}).listen(3000, function(req, res) {
	console.log('Port 3000 is listening');
});


module.exports = app;