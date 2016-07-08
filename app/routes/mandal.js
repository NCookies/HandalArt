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


/* 어떤 사이트로 로그인 되어 있는지 확인(local, google 등) */
var getProvider = function(req) {
    var provider;

    if (req.session.passport.user.provider == undefined) {
        provider = "";
        console.log("provider is local");
    }
    else {
        provider = req.session.passport.user.provider + ":";
        console.log("provider is " + provider.split(':')[0]);
    }

    return provider;
}


// =====================================
// /mandal_make ========================
// =====================================
exports.makeMandal = function(req, res) {

    var provider = getProvider(req);
    var authId = provider + req.session.passport.user.id;

    console.log('authId : ' + authId);

    var mandalIndex;
    var mandalUltimateData;
    var mandalSubData;

    pool.getConnection(function(err, connection) {
        async.waterfall([
            function getMandalId(getMandalIdCallback) {
                connection.query('SELECT DISTINCT mandal_Id FROM mandal where member_AuthId = ? order by mandal_Id ASC',
                [authId], function(err, rows) {
                    var mandalIndex = JSON.stringify(rows);

                    if (err) {
                        getMandalIdCallback(err);
                    } else {
                        console.log("Successfully get Mandal Id");
                        getMandalIdCallback(null, mandalIndex);
                    }
                });
            }, 
            function getMandalUltimate(mandalIndex, getMandalUltimateCallback) {
                connection.query('SELECT DISTINCT mandal_content FROM mandal where member_AuthId = ? order by mandal_Id ASC',
                [authId], function(err, rows) {
                    mandalUltimateData = JSON.stringify(rows);

                    if (err) {
                        getMandalUltimateCallback(err);
                    } else {
                        console.log("Successfully get Mandal Ultimate");
                        getMandalUltimateCallback(null, mandalIndex, mandalUltimateData);
                    }
                });
            },
            function getMandalSub(mandalIndex, mandalUltimateData, getMandalSubCallback) {
                connection.query('SELECT DISTINCT mandalSub_Content FROM mandalSub where member_AuthId = ? order by mandal_Id ASC',
                [authId], function(err, rows) {
                    mandalSubData = JSON.stringify(rows);
                    
                    res.render('mandal_make', 
                    { 
                        mandalIndex : mandalIndex,
                        ultimate : mandalUltimateData,
                        sub : mandalSubData
                    });

                    if (err) {
                        getMandalSubCallback(err);
                    } else {
                        getMandalSubCallback(null, 'done');
                    }
                });
            }
            ],
            function(err, result) {
                if (err) {
                    console.log(err);
                    connection.release();
                    res.render('mandal_make', 
                    { 
                        mandalIndex : false,
                        ultimate : false,
                        sub : false
                    });
                }
                console.log("result : " + result);
            }
        );
        /* end of waterfall */

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

        console.log("authId : " + authId);

        if (req.params.id == "main") { // 없으면 새로 추가
            console.log('============== new mandal ==============');

            async.waterfall([
                function getMandalId(getMandalIdCallback) {
                    connection.query('SELECT MAX(mandal_Id) FROM mandal WHERE member_AuthId = ?',
                    [authId], function(err, rows) {

                        mandalId = Number(JSON.stringify(rows[0]).match(/\d+/)[0]) + 1;
                        // "max(mandal_Id)" : 1에서 '()' 때문에 키로 인식하지 못함
                        console.log('mandalId : ' + mandalId);

                        if (err) {
                            getMandalIdCallback(err);
                        } else {
                            console.log("Successfully get Mandal Id");
                            getMandalIdCallback(null, mandalId);
                        }
                    });
                },
                function insertMandal(mandalId, insertMandalCallback) {
                    connection.query("INSERT INTO mandal VALUES (?, ?, ?, ?)",
                    [authId, mandalId, req.body.ultimateArticle, null], 
                    function(err, rows) {
                        if (err) {
                            insertMandalCallback(err);
                        } else {
                            console.log("Successfully insert mandal");
                            insertMandalCallback(null, mandalId);
                        }
                    });
                },
                function insertMandalSub(mandalId, insertMandalSubCallback) {
                    for (var subIndex = 0; subIndex < 8; subIndex++) {
                        var query = "INSERT INTO mandalSub VALUES (?, ?, ?, ?)";
                        console.log('subindex : ' + subIndex);

                        (function () {
                            var sub = subIndex;
                            connection.query(query,
                            [authId, mandalId, sub + 1, req.body.subArticle[sub]], 
                            function(err, rows) {
                                if (err) {
                                    insertMandalSubCallback(err);
                                }
                            });
                        }());
                    }
                    console.log("Successfully insert mandal sub");
                    insertMandalSubCallback(null, mandalId);
                },
                function insertMandalDetail(mandalId, insertMandalDetailCallback) {
                    var detailArticle = req.body.detailArticle;

                    for (var detailIndex = 0; detailIndex < 64; detailIndex += 8) {
                        var query = "INSERT INTO mandaldetail VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        console.log('detailIndex : ' + detailIndex);

                        (function () {
                            var detail = detailIndex;
                            connection.query(query,
                            [authId, mandalId, parseInt(detail/8 + 1), detailArticle[detail], 
                            detailArticle[detail + 1], detailArticle[detail + 2], 
                            detailArticle[detail + 3], detailArticle[detail + 4],
                            detailArticle[detail + 5], detailArticle[detail + 6],
                            detailArticle[detail + 7]], 
                            function(err, rows) {
                                if (err) {
                                    insertMandalDetailCallback(err);
                                }
                            });
                        }());
                    }
                    console.log("Successfully insert mandal detail");
                    insertMandalDetailCallback(null, 'done');
                }
                ],
                function(err, result) {
                    if (err) {
                        console.log(err);
                        connection.release();
                        res.render('mandal_make', 
                        { 
                            mandalIndex : false,
                            ultimate : false,
                            sub : false
                        });
                    }
                    console.log("result : " + result);
                }
            );
            /* end of mandal insert waterfall */
        }

        else { // 업데이트
            console.log('============== modify mandal ==============');

            async.series([
                function updateMandal(updateMandalCallback) {
                    connection.query("UPDATE mandal SET mandal_content = ? WHERE member_AuthId = ? AND mandal_Id = ?",
                    [req.body.ultimateArticle, authId, req.params.id, null], 
                    function(err, rows) {
                        if (err) {
                            updateMandalCallback(err);
                        } else {
                            console.log("Successfully update mandal");
                            updateMandalCallback(null);
                        }
                    });
                },
                function updateMandalSub(updateMandalSubCallback) {
                    for (var subIndex = 0; subIndex < 8; subIndex++) {
                        var query = "UPDATE mandalSub SET mandalSub_Content = ? WHERE member_AuthId = ? AND mandal_Id = ? AND mandalSub_Id = ?";
                        console.log('subindex : ' + subIndex);

                        (function () {
                            var sub = subIndex;
                            connection.query(query,
                            [req.body.subArticle[subIndex], authId, req.params.id, subIndex + 1], 
                            function(err, rows) {
                                if (err) {
                                    updateMandalSubCallback(err);
                                }
                                console.log("in query" + sub);
                            });
                        }());
                    }
                    console.log("Successfully update mandal sub");
                    updateMandalSubCallback(null);
                },
                function updateMandalDetail(updateMandalDetailCallback) {
                    for (var detailIndex = 0; detailIndex < 64; detailIndex += 8) {
                        var detailArticle = req.body.detailArticle;
                        var query = "UPDATE mandalDetail SET mandalDetail_Content1 = ?, mandalDetail_Content2 = ?, " +
                        "mandalDetail_Content3 = ?, mandalDetail_Content4 = ?, mandalDetail_Content5 = ?, " + 
                        "mandalDetail_Content6 = ?, mandalDetail_Content7 = ?, mandalDetail_Content8 = ? " + 
                        " WHERE member_AuthId = ? AND mandal_Id = ? AND mandalSub_Id = ?";
                        console.log('detailIndex : ' + detailIndex);

                        (function () {
                            var detail = detailIndex;
                            connection.query(query,
                            [detailArticle[detailIndex], detailArticle[detailIndex + 1], 
                            detailArticle[detailIndex + 2], detailArticle[detailIndex + 3], 
                            detailArticle[detailIndex + 4], detailArticle[detailIndex + 5], 
                            detailArticle[detailIndex + 6], detailArticle[detailIndex + 7],
                            authId, req.params.id, parseInt(detailIndex / 8 + 1)], 
                            function(err, rows) {
                                if (err) {
                                    updateMandalDetailCallback(err);
                                }
                            });
                        }());
                    }
                    console.log("Successfully insert mandal detail");
                    updateMandalDetailCallback(null, 'done');
                }
                ],
                function(err, result) {
                    if (err) {
                        console.log(err);
                        connection.release();
                        res.render('mandal_make', 
                        { 
                            mandalIndex : false,
                            ultimate : false,
                            sub : false
                        });
                    }
                    console.log("result : " + result);
                }
            );
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

        console.log('params : ' + req.params.id);

        async.waterfall([
            function selectMandal(selectMandalCallback) {
                connection.query('SELECT * FROM mandal where member_AuthId = ? and mandal_Id = ?',
                [authId, req.params.id], function(err, rows) {
                    mandalUltimateData = JSON.stringify(rows);

                    if (err) {
                        selectMandalCallback(err);
                    } else {
                        selectMandalCallback(null, mandalUltimateData);
                    }
                });
            },
            function selectMandalSub(mandalUltimateData, selectMandalSubCallback) {
                connection.query('SELECT * FROM mandalSub where member_AuthId = ? and mandal_Id = ?',
                [authId, req.params.id], function(err, rows) {
                    mandalSubData = JSON.stringify(rows);

                    if (err) {
                        selectMandalSubCallback(err);
                    } else {
                        selectMandalSubCallback(null, mandalUltimateData, mandalSubData);
                    }
                });
            },
            function selectMandalDetail(mandalUltimateData, mandalSubData, selectMandalDetailCallback) {
                connection.query('SELECT * FROM mandalDetail where member_AuthId = ? and mandal_Id = ?',
                [authId, req.params.id], function(err, rows) {
                    mandalDetailData = JSON.stringify(rows);

                    res.render('mandal_main', 
                    { 
                        ultimate : mandalUltimateData, 
                        sub : mandalSubData, 
                        detail : mandalDetailData
                    });

                    if (err) {
                        selectMandalDetailCallback(err);
                    } else {
                        selectMandalDetailCallback(null, 'done');
                    }
                });
            }
            ], 
            function(err, result) {
                if (err) {
                    console.log(err);
                    connection.release();
                    res.render('mandal_make', 
                    { 
                        mandalIndex : false,
                        ultimate : false,
                        sub : false
                    });
                }
                console.log("result : " + result);
            }
        );

    });
}
