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


exports.makeMandal = function(req, res) {
    res.render('mandal_make');
}


exports.mainMandal = function(req, res) {
    var arr = new Array();
	for (var i = 0; i <= 81; i++) {
		arr.push('test' + i);
	}
 	
	res.render('mandal_main', {jsonObj : arr});
}

exports.getData = function(req, res) {
	if (req.xhr || req.accepts('json, html')==='json') {
		console.log(JSON.stringify(req.body))
		//res.send({success: true});
		// (에러가 있다면 { error: 'error description' }을 보냄)
	} else {
		res.redirect(303, '/');
		// (에러가 있다면 에러 페이지로 리다이렉트)
	}

    if (req.session.passport.user.id == "undefined") {
        res.redirect(303, '/');
    }

	// 4, 13, 22 ... : sub
	// 0 ~ 3 / 5 ~ 8 : detail 

    pool.getConnection(function(err, connection) {
        var mandalId;
        connection.query('select max(mandal_Id) from mandal_ultimate where member_Id = ?',//'select mandal_Id from mandal_ultimate where member_Id = ? order by mandal_Id desc limit 1'//
            [req.session.passport.user.id], function(err, rows) {
                mandalId = Number(JSON.stringify(rows[0]).match(/\d+/)[0]) + 1;
                // "max(mandal_Id)" : 1에서 '()' 때문에 키로 인식하지 못함

                for (var subIndex = 0; subIndex < 8; subIndex++) {
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
                    console.log(parseInt(detailIndex/8 + 1));
                    console.log(req.body.detailArticle[detailIndex]);

                    connection.query("insert into mandal_detail values(?, ?, ?, ?, ?)",
                    [ req.session.passport.user.id, "bucket_1", mandalId, parseInt(detailIndex/8 + 1), req.body.detailArticle[detailIndex] ], function(err, rows) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }
                    });
                }
        });
        connection.release();
    });
}
