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


var pool = mysql.createPool({
    host :'localhost',
    port : 3306,
    user : 'root',
    password : 'mysqlhandalart3576!',
    database : 'handalart',
    connectionLimit : 20,
    waitForConnections : false
});

// =====================================
// /mandal routes ======================
// =====================================
exports.makeMandal = function(req, res) {

    /*pool.getConnection(function(err, connection) {
        connection.query('select distinct mandal_Id from mandal_ultimate where member_Id = ? order by mandal_Id asc;',
        [req.session.passport.user.id], function(err, rows) {
            if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }
            res.render('mandal_make', { mandalIndex : JSON.stringify(rows) });
        });

        connection.release();
    });*/
    res.render('mandal_make', { mandalIndex : false });
}

// =====================================
// MAKE NEW MANDAL =====================
// =====================================
exports.makeNewMandal = function(req, res) {
    res.render('mandal_main', { center : false, mandal : false});
}


// =====================================
// GET DATA FOR MANDAL =================
// =====================================
exports.getData = function(req, res) {

    pool.getConnection(function(err, connection) {

        var mandalId;

        if (req.params.id == "main") { // 없으면 새로 추가
            console.log('new mandal');

            /* 어떤 사이트로 로그인 되어 있는지 확인(local, google 등) */
            var provider;

            if (req.session.passport.user.provider == undefined) {
                provider = "local:";
                console.log("provider is local");
            }
            else {
                provider = req.session.passport.user.provider + ":";
                console.log("provider is " + provider);
            }

            var authId = provider + req.session.passport.user.id;

            /* mandal_Id 설정 */
            connection.query('SELECT MAX(mandal_Id) FROM mandal WHERE member_AuthId = ?',
            [authId], function(err, rows) {

                mandalId = Number(JSON.stringify(rows[0]).match(/\d+/)[0]) + 1;
                // "max(mandal_Id)" : 1에서 '()' 때문에 키로 인식하지 못함
                console.log('mandalId : ' + mandalId);

                connection.query("insert into mandal values(?, ?, ?, ?)",
                [authId, mandalId, req.body.ultimateArticle, null], 
                function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }
                });

                for (var subIndex = 0; subIndex < 8; subIndex++) {
                    connection.query("insert into mandalSub values(?, ?, ?, ?)",
                    [authId, mandalId, subIndex + 1, req.body.subArticle[subIndex]], 
                    function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }
                    });
                }

                for (var detailIndex = 0; detailIndex < 64; detailIndex += 8) {
                    var detailArticle = req.body.detailArticle;

                    console.log(detailIndex  + ":" + detailArticle[detailIndex]);
                    
                    connection.query("insert into mandaldetail values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [authId, mandalId, parseInt(detailIndex/8 + 1), detailArticle[detailIndex], 
                    detailArticle[detailIndex + 1], detailArticle[detailIndex + 2], 
                    detailArticle[detailIndex + 3], detailArticle[detailIndex + 4],
                    detailArticle[detailIndex + 5], detailArticle[detailIndex + 6],
                    detailArticle[detailIndex + 7]], 
                    function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }
                    });
                }
                

                /*for (var subIndex = 0; subIndex < 8; subIndex++) {
                    connection.query("insert into mandal_ultimate values(?, ?, ?, ?)",
                    [req.session.passport.user.id, mandalId, "bucket_1", req.body.subArticle[subIndex]], function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }
                    });
                }
                connection.query("insert into mandal_ultimate values(?, ?, ?, ?)",
                [req.session.passport.user.id, mandalId, "bucket_1", req.body.ultimateArticle], function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }
                });
                for (var detailIndex = 0; detailIndex < 64; detailIndex++) {

                    connection.query("insert into mandal_detail values(?, ?, ?, ?, ?)",
                    [ req.session.passport.user.id, "bucket_1", mandalId, parseInt(detailIndex/8 + 1), 
                    req.body.detailArticle[detailIndex] ], function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }
                    });
                }*/
            });
        }
        else { // 삭제했다가 다시 추가(DB 설계 문제...)
            connection.query('delete from mandal_ultimate where mandal_Id = ? and member_Id = ?',
            [req.params.id, req.session.passport.user.id], function(err, rows) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }
            });

            connection.query('delete from mandal_detail where mandal_Id = ? and member_Id = ?',
            [req.params.id, req.session.passport.user.id], function(err, rows) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }
            });

            for (var subIndex = 0; subIndex < 8; subIndex++) {
                connection.query("insert into mandal_ultimate values(?, ?, ?, ?)",
                [req.session.passport.user.id, req.params.id, "bucket_1", req.body.subArticle[subIndex]], function(err, rows) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }
                });
            }
            connection.query("insert into mandal_ultimate values(?, ?, ?, ?)",
            [req.session.passport.user.id, req.params.id, "bucket_1", req.body.ultimateArticle], function(err, rows) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }
            });
            for (var detailIndex = 0; detailIndex < 64; detailIndex++) {

                connection.query("insert into mandal_detail values(?, ?, ?, ?, ?)",
                [ req.session.passport.user.id, "bucket_1", mandalId, parseInt(detailIndex/8 + 1), 
                req.body.detailArticle[detailIndex] ], function(err, rows) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }
                });
            }
        }

        connection.release();
    });
}


exports.mainMandal = function(req, res) {
    pool.getConnection(function(err, connection) {
        var mandalCenterData;
        var mandalData;


        connection.query('select * from mandal_ultimate where member_Id = ? and mandal_Id = ?',
        [req.session.passport.user.id, req.params.id], function(err, rows) {
            mandalCenterData = JSON.stringify(rows);

            connection.query('select * from mandal_detail where member_Id = ? and mandal_Id = ?',
            [req.session.passport.user.id, req.params.id], function(err, rows) {
                mandalData = JSON.stringify(rows);

                //console.log("data : " + mandalData);

                res.render('mandal_main', { center : mandalCenterData, mandal : mandalData});
            });
        });

        connection.release();
    });
 	
	//res.render('mandal_main', {jsonObj : arr});
}

