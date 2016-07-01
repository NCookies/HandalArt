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
    console.log('url : ' + req.url + req.method);


    pool.getConnection(function(err, connection) {
        connection.query('SELECT EXISTS (SELECT * FROM member where member_AuthId = ?)', 
        ["local:" + req.body.id], function(err, rows) {
            userExists = Number(JSON.stringify(rows[0]).split(':')[2].match(/\d+/)[0]);
            console.log(userExists);

            /* 중복되는 아이디가 없을 때 */
            if (userExists == 0) {
                connection.query('INSERT INTO member VALUES (?, ?, ?, ?)',
                ["local:" + req.body.id, req.body.password, req.body.email, req.body.displayname],
                function(err, rows) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            res.redirect('/');
                            //throw err;
                            
                        });
                    }

                    console.log("query : insert");

                    connection.query('INSERT INTO bucketlist VALUES (?, ?, ?, ?, ?)',
                    ['local:' + req.body.id, 0, "START", "0000-00-00", "ACHIEVED"],
                    function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }

                        console.log('insert into bucketlist starting');

                        connection.query('INSERT INTO mandal VALUES (?, ?, ?, ?)',
                        ['local:' +  req.body.id, 0, "START", null],
                        function(err, rows) {
                            if (err) {
                                console.error(err);
                                connection.rollback(function () {
                                    console.error('rollback error');
                                    throw err;
                                });
                            }

                            console.log('insert into mandal starting');

                            var user = {
                                'id' : req.body.id,
                                'displayName': req.body.displayname
                            }

                            req.login(user, function(err) {
                                if (err) { return next(err); }
                                req.session.save(function() {
                                    res.redirect('/');
                                });
                            });

                        });
                    });

                });
            }
            /* 중복되는 아이디가 있을 때 */
            else {
                console.log("query : exists");
                //res.render('index', { message : '이미 존재하는 아이디입니다. 다시 한 번 입력해주세요.'});
                res.redirect('/');
            }
        });

        connection.release();
    });

    //res.redirect('/');
}
