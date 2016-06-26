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


/* 어떤 사이트로 로그인 되어 있는지 확인(local, google 등) */
var getProvider = function(req) {
    var provider;

    if (req.session.passport.user.provider == undefined) {
        provider = "local:";
        console.log("provider is local");
    }
    else {
        provider = req.session.passport.user.provider + ":";
        console.log("provider is " + provider.split(':')[0]);
    }

    return provider;
}



// =====================================
// /mandal routes ======================
// =====================================
exports.makeMandal = function(req, res) {

    var provider = getProvider(req);
    var authId = provider + req.session.passport.user.id;

    pool.getConnection(function(err, connection) {
        connection.query('SELECT DISTINCT mandal_Id FROM mandal where member_AuthId = ? order by mandal_Id ASC',
        [authId], function(err, rows) {
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
    });
}

// =====================================
// MAKE NEW MANDAL =====================
// =====================================
exports.makeNewMandal = function(req, res) {
   res.render('mandal_main', 
   { 
        ultimate : false, 
        sub : false, 
        detail : false
    });
}


// =====================================
// GET DATA FOR MANDAL =================
// =====================================
exports.getData = function(req, res) {

    pool.getConnection(function(err, connection) {

        var mandalId;

        var provider = getProvider(req);
        var authId = provider + req.session.passport.user.id;


        if (req.params.id == "main") { // 없으면 새로 추가
            console.log('============== new mandal ==============');

            /* mandal_Id 설정 */
            connection.query('SELECT MAX(mandal_Id) FROM mandal WHERE member_AuthId = ?',
            [authId], function(err, rows) {

                mandalId = Number(JSON.stringify(rows[0]).match(/\d+/)[0]) + 1;
                // "max(mandal_Id)" : 1에서 '()' 때문에 키로 인식하지 못함
                console.log('mandalId : ' + mandalId);

                connection.query("INSERT INTO mandal VALUES (?, ?, ?, ?)",
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
                    connection.query("INSERT INTO mandalSub VALUES (?, ?, ?, ?)",
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
                    
                    connection.query("INSERT INTO mandaldetail VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
                /* End of SELECT MAX query */
            });
        }

        else { // 업데이트
            console.log('============== modify mandal ==============');

            connection.query("UPDATE mandal SET mandal_content = ? WHERE member_AuthId = ? AND mandal_Id = ?",
            [req.body.ultimateArticle, authId, req.params.id, null], 
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
                connection.query("UPDATE mandalSub SET mandalSub_Content = ? WHERE member_AuthId = ? AND mandal_Id = ? AND mandalSub_Id = ?",
                [req.body.subArticle[subIndex], authId, req.params.id, subIndex + 1], 
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
                
                connection.query("UPDATE mandalDetail SET mandalDetail_Content1 = ?, mandalDetail_Content2 = ?, " +
                " mandalDetail_Content3 = ?, mandalDetail_Content4 = ?, mandalDetail_Content5 = ?, " + 
                "mandalDetail_Content6 = ?, mandalDetail_Content7 = ?, mandalDetail_Content8 = ?" + 
                "WHERE member_AuthId = ? AND mandal_Id = ? AND mandalSub_Id = ?"
                [
                detailArticle[detailIndex], detailArticle[detailIndex + 1], 
                detailArticle[detailIndex + 2], detailArticle[detailIndex + 3], 
                detailArticle[detailIndex + 4], detailArticle[detailIndex + 5], 
                detailArticle[detailIndex + 6], detailArticle[detailIndex + 7],
                authId, mandalId, parseInt(detailIndex/8 + 1)
                ], 
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
        }

        connection.release();
    });
}


exports.mainMandal = function(req, res) {
    pool.getConnection(function(err, connection) {
        var mandalUltimateData;
        var mandalSubData;
        var mandalDetailData;

        var provider = getProvider(req);
        var authId = provider + req.session.passport.user.id;

        console.log('parms : ' + req.params.id);

        connection.query('SELECT * FROM mandal where member_AuthId = ? and mandal_Id = ?',
        [authId, req.params.id], function(err, rows) {
            if (err) {
                console.error(err);
                connection.rollback(function () {
                    console.error('rollback error');
                    throw err;
                });
            }
            mandalUltimateData = JSON.stringify(rows);
            console.log(mandalUltimateData);

            connection.query('SELECT * FROM mandalSub where member_AuthId = ? and mandal_Id = ?',
            [authId, req.params.id], function(err, rows) {
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }
                mandalSubData = JSON.stringify(rows);
                console.log(mandalSubData);

                connection.query('SELECT * FROM mandalDetail where member_AuthId = ? and mandal_Id = ?',
                [authId, req.params.id], function(err, rows) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }
                    mandalDetailData = JSON.stringify(rows);
                    console.log("detail : " + mandalDetailData);

                    res.render('mandal_main', 
                    { 
                        ultimate : mandalUltimateData, 
                        sub : mandalSubData, 
                        detail : mandalDetailData
                    });
                });
            });
        });

        connection.release();
    });
 	
	//res.render('mandal_main', {jsonObj : arr});
}

