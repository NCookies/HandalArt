
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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

function getRandomCode(iLength) {
    var arr="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!@#$%^&*()-+|_=\[]{}<>?/.;";
    var randomstring = '';

    for (var i=0; i < iLength; i++) {
        var rnum = Math.floor(Math.random() * arr.length);
        randomstring += arr.substring(rnum,rnum+1);
    }

    console.log('random : ' + randomstring);
    return randomstring;
}


module.exports = function (passport) {
 

    // =====================================
	// LOCAL AUTH ==========================
	// =====================================
    passport.use(new LocalStrategy({
            usernameField : 'id', // user email
            passwordField : 'password', // user password
            passReqToCallback : true
            // 인증을 수행하는 인증 함수, HTTP request를 그대로  전달할지 여부
        },
        function(req ,userid, password, done) {
            var account;

            var id = userid;
            var passwd = password;

            pool.getConnection(function(err, connection) {
                connection.query("SELECT * FROM member WHERE member_AuthId = ?",
                ['local:'+id], function(err, rows) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }

                    account = JSON.parse(JSON.stringify(rows));

                    console.log('account : ' + account);

                    if (account == null) {
                        console.log("No Account");
                        return done(null, false, 
                        { message : '아이디 또는 비밀번호가 잘못되었습니다'});
                    }

                    if (userid == account[0].member_AuthId.split(':')[1] &&
                    password == account[0].member_Password) {
                        var user = { 'displayName': account[0].member_DisplayName }
                        //'id': rows[0].member_AuthId };
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });

                connection.release();
            });
        }
    ));


    // =====================================
	// FACEBOOK AUTH =======================
	// =====================================
    passport.use(new FacebookStrategy({
            clientID: '594228160736253',
            clientSecret: '1cd92a04f2aa948c175013002f00341e',
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields:['id', 'email', 'displayName']
        },
        function(accessToken, refreshToken, profile, done) {
            pool.getConnection(function(err, connection) {
                connection.query('SELECT EXISTS ( SELECT * FROM member WHERE member_AuthId = ?);',
                ['facebook:' + profile.id], function(err, rows) { // 계정이 있으면 1, 없으면 0
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }

                    console.log('auth Id : ' + JSON.stringify(rows));

                    var auth_Id = Number(JSON.stringify(rows[0]).split(':')[2].match(/\d+/)[0]);

                    console.log('auth_Id : ' + auth_Id);


                    if (auth_Id == 1) { // 계정이 등록된 경우
                        var user = {
                            'id' : profile.id,
                            'displayName' : profile.displayName
                        };

                        console.log("이미 있음");

                        return done(null, profile);
                    }
                    else { // 계정이 등록되지 않았던 경우
                        connection.query('INSERT INTO member VALUES (?, ?, ?, ?)',
                        ['facebook:' + profile.id, getRandomCode(45), profile.emails[0].value, profile.displayName],
                        function(err, rows) {
                            if (err) {
                                console.error(err);
                                connection.rollback(function () {
                                    console.error('rollback error');
                                    throw err;
                                });
                            }
                        });

                        var user = {
                            'id' : profile.id,
                            'displayName' : profile.displayName
                        };

                        console.log("DB에 추가")

                        return done(null, user);
                        // DB에 추가
                    }
                });
                
                connection.release();
            });
        }
    ));


    // =====================================
	// GOOGLE AUTH =========================
	// =====================================
    passport.use(new GoogleStrategy({
        clientID: '947227472989-d2i27nlkn6la0gfdmlaocs2ah6aaa4tr.apps.googleusercontent.com',
        clientSecret: 'LDZUY-y4KPijlulViqLR7wlh',
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        pool.getConnection(function(err, connection) {
                connection.query('SELECT EXISTS ( SELECT * FROM member WHERE member_AuthId = ?);',
                ['google:' + profile.id], function(err, rows) { // 계정이 있으면 1, 없으면 0
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }

                    console.log('auth Id : ' + JSON.stringify(rows));

                    var auth_Id = Number(JSON.stringify(rows[0]).split(':')[2].match(/\d+/)[0]);

                    console.log('auth_Id : ' + auth_Id);


                    if (auth_Id == 1) { // 계정이 등록된 경우
                        var user = {
                            'id' : profile.id,
                            'displayName' : profile.displayName
                        };

                        console.log("이미 있음");

                        return done(null, profile);
                    }
                    else { // 계정이 등록되지 않았던 경우
                        connection.query('INSERT INTO member VALUES (?, ?, ?, ?)',
                        ['google:' + profile.id, getRandomCode(45), profile.emails[0].value, profile.displayName],
                        function(err, rows) {
                            if (err) {
                                console.error(err);
                                connection.rollback(function () {
                                    console.error('rollback error');
                                    throw err;
                                });
                            }
                        });

                        var user = {
                            'id' : profile.id,
                            'displayName' : profile.displayName
                        };

                        console.log("DB에 추가")

                        return done(null, user);
                        // DB에 추가
                    }
                });

                connection.release();
            });
        console.log(profile.id);
        done(null, profile);
        }
    ));



    passport.serializeUser(function(user, done) {
        // user : LocalStrategy 객체의 인증함수에서 done(null,user)에 의해 리턴된 값이 넘어옴
        console.log('serialize', user);
        done(null, user); // session에 저장할 정보
    });
    // 로그인에 성공하면 사용자 정보를 세션에 저장

    passport.deserializeUser(function(user, done) {
        console.log('deserialize', user); 
        /*pool.getConnection(function(err, connection) {
            connection.query("SELECT * FROM member WHERE id = ? ",[user.id], function(err, rows){
                done(err, rows[0]);
            });

            connection.release();
        })*/
        
        done(null, user);
    });
    // node.js의 모든 페이지에 접속할 때마다 호출, 사용자 정보를 세션에서 읽어옴

    // 호출될 때마다 매번 사용자 id 또는 email을 이용하여 DB에서 추가로 정보를 가져옴
    // 하지만 이 방식은 DB 접근이 너무 잦기 때문에 비추천
    // 저장할 데이터가 너무 크지 않은 이상 사용자 로그인 데이타를 모두 serialize시에 session에 넣는 것을 권장
    // 데이터가 너무 많으면 redis와 같은 외부 메모리 DB를 이용해서 저장
}
