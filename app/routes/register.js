var mysql = require('mysql');

var pool = mysql.createPool({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : 'mysqlhandalart3576!',
    database:'handalart',
    connectionLimit:20,
    waitForConnections:false
});

var async = require('async');


exports.regeist = function(req, res) {
    console.log("id : " + req.body.id);
    console.log('url : ' + req.url);
    console.log('method : ' + req.method);


    pool.getConnection(function(err, connection) {
        connection.query('SELECT EXISTS (SELECT * FROM member where member_AuthId = ?)', 
        ["local:" + req.body.id], function(err, rows) {
            userExists = Number(JSON.stringify(rows[0]).split(':')[2].match(/\d+/)[0]);
            console.log(userExists);
 
            /* 중복되는 아이디가 없을 때 */
            if (userExists == 0) {
                async.series([
                    function insertMember(insertMemberCallback) {
                        connection.query('INSERT INTO member VALUES (?, ?, ?, ?)',
                        ["local:" + req.body.id, req.body.password, req.body.email, req.body.displayname],
                        function(err, rows) {
                            if (err) {
                                insertMemberCallback(err);
                            } else {
                                console.log("Successfully insert member");
                                insertMemberCallback(null, rows);
                            }
                        });
                    },
                    function insertBucket(insertBucketCallback) {
                        connection.query('INSERT INTO bucketlist VALUES (?, ?, ?, ?, ?)',
                        ['local:' + req.body.id, 0, "START", "0000-00-00", "ACHIEVED"],
                        function(err, rows) {
                            if (err) {
                                insertBucketCallback(err);
                            } else {
                                console.log("Successfully insert bucketlist");
                                insertBucketCallback(null, rows);
                            }
                        });
                    },
                    function insertMandal(insertMandalCallback) {
                        connection.query('INSERT INTO mandal VALUES (?, ?, ?, ?)',
                        ['local:' +  req.body.id, 0, "START", null],
                        function(err, rows) {
                            if (err) {
                                insertMandalCallback(err);
                            } else {
                                console.log("Successfully insert mandal");
                                insertMandalCallback(null, rows);
                            }
                        });
                    },
                    function login(loginCallback) {
                        var user = {
                            'id' : req.body.id,
                            'displayName': req.body.displayname
                        }

                        req.login(user, function(err) {
                            if (err) { return next(err); }
                            req.session.save(function() {
                                loginCallback(null, 'success regist and login!!');
                            });
                        });
                    }
                    ],
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            connection.release();
                            res.render('index', { user : false, message : '에러가 발생했습니다' });
                        }
                        console.log("result : " + result);
                        res.render('index', { user : false, message : '회원가입이 성공적으로 되었습니다.' });
                    }
                );

            }
            /* 중복되는 아이디가 있을 때 */
            else {
                console.log("query : exists");
                connection.release();
                res.render('index', { message : '이미 존재하는 아이디입니다. 다시 한 번 입력해주세요.' });
            }
        });

    });

}
