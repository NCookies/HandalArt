var mysql = require('mysql');

var pool = mysql.createPool({
    host    :'127.0.0.1',
    port : 3306,
    user : 'root',
    // password : 'mysqlhandalart3576!',
    password : 'ehehgks!!123',
    database:'handalart',
    connectionLimit:20,
    waitForConnections:false
});
/* mysql 연결 설정 */

var async = require('async');


/* 어떤 사이트로 로그인 되어 있는지 확인(local, google, facebook 등) */
var getProvider = function(req) {
    var provider;

    console.log('[provider] : ' + req.session.passport.user.provider);
    /* 어떤 계정과 연동되어 있는지 확인 */

    if (req.session.passport.user.provider == undefined) {
        /* 정의되어 있지 않다면 로컬로 */
        provider = "";
        console.log("provider is local");

        return provider;
    } else if(req.session.passport.user.provider == "local") {
        return "";
    }
    else {
        provider = req.session.passport.user.provider + ":";
        console.log("provider is " + provider.split(':')[0]);
    }

    return provider;
    // 계정의 provider 반환
}


// =====================================
// SEE MANDALS =========================
// =====================================
exports.makeMandal = function(req, res) {

    var provider = getProvider(req);
    var authId = provider + req.session.passport.user.id;
    // 접속한 user의 id값을 세션을 통하여 가져옴

    console.log('authId : ' + authId);

    var mandalIndex; // 만다라트 목록 인덱스
    var mandalUltimateData; // 만다라트 최종 목표, 미리보기에서 보여짐
    var mandalSubData; // 만다라트 보조 목표, 미리보기에서 보여짐(보류)

    pool.getConnection(function(err, connection) {

        async.waterfall([
            /* 비동기 방식을 순차적으로 진행하기 위해서 async 모듈 사용 */

            /* waterfall나 series는 첫 번째 요소로 배열 안에 실행할 함수들을 작성하고 */
            /* 두번째 인자로 오류가 발생하거나 모든 함수가 실행되었을 때 실행되는 함수를 작성 */

            /* 사용자가 등록한 모든 만다라트 ID를 가져옴 */
            function getMandalId(getMandalIdCallback) {
                connection.query('SELECT DISTINCT mandal_Id FROM mandal where member_AuthId = ? order by mandal_Id ASC',
                [authId], function(err, rows) {
                    /* DB에서 해당 유저의 만다라트 ID 목록을 가져옴(오름차순) */
                    var mandalIndex = JSON.stringify(rows);

                    if (err) {
                        getMandalIdCallback(err);
                        // 에러가 발생하면 콜백 함수에 에러 전달
                    } else {
                        console.log("Successfully get Mandal Id");
                        getMandalIdCallback(null, mandalIndex);
                        // 에러가 없다면 다음 함수에 인자를 전달하며 실행
                    }
                });
            },

            /* getMandalId 함수에서 mandalIndex를 받아오지만 사용하지는 않음 */
            /* 만다라트 최종목표의 내용들을 가져옴 */
            function getMandalUltimate(mandalIndex, getMandalUltimateCallback) {

                connection.query('SELECT DISTINCT mandal_content FROM mandal where member_AuthId = ? order by mandal_Id ASC',
                [authId], function(err, rows) {
                    mandalUltimateData = JSON.stringify(rows);

                    if (err) {
                        getMandalUltimateCallback(err); // 에러 발생
                    } else {
                        console.log("Successfully get Mandal Ultimate");
                        getMandalUltimateCallback(null, mandalIndex, mandalUltimateData);
                    }
                });
            },

            /* 만다라트 보조 목표 내용들을 가져오고 ejs 파일을 렌더링함 */
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
            /* 모든 함수가 실행됨 */

            ],
            function(err, result) {

                /* 에러가 발생했거나 모든 함수가 종료되었을 때 실행 */
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

        connection.release(); // DB connection 해제
    });
}

// =====================================
// MAKE NEW MANDAL =====================
// =====================================
exports.makeNewMandal = function(req, res) {
    /* 새로운 만다라트를 만듦 */
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
    /* 만다라트를 저장하거나 수정했을 때 */

    pool.getConnection(function(err, connection) {

        var mandalId;

        var provider = getProvider(req); // 제공사를 얻어옴
        var authId = provider + req.session.passport.user.id;
        // DB에서 실제로 사용하는 id값을 가짐

        console.log("authId : " + authId);

        if (req.params.id == "main") {
            /* 기존에 존재하지 않던 만다라트라면 ID를 새로 할당하여 생성 */
            /* 접속한 url을 통하여 구분 */
            console.log('============== new mandal ==============');

            async.waterfall([

                /* 현재 해당 사용자의 만다라트 중 ID 값이 가장 큰 것에서 1을 더하여 고유 ID 할당 */
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

                /* 만다라트 최종목표 추가 */
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

                /* 만다라트 보조목표 추가 */
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
                        /* 비동기 프로그래밍에서 루프 안에서 query문과 같이 처리가 오래걸리는 작업을 하면 */
                        /* 루프가 모드 끝난 후에 작업이 시작됨                                         */
                        /* 그렇기 때문에 위와 같이 별도의 조치를 취해야 함                              */
                    }
                    console.log("Successfully insert mandal sub");
                    insertMandalSubCallback(null, mandalId);
                },

                /* 만다라트 세부 사항 추가 */
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
                        /* 루프를 도므로 위와 같이 별도의 조치를 취함 */
                    }
                    console.log("Successfully insert mandal detail");
                    insertMandalDetailCallback(null, 'done');
                }

                ],

                /* 에러 발생 또는 위의 모든 함수가 실행되었을 때 */
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


        /* 기존에 존재하던 만다라트라면 DB의 내용을 UPDATE함 */
        /* 예를 들면 "/mandal/main/3" 과 같은 url로 요청됨 */
        else {
            console.log('============== modify mandal ==============');

            /*  기본적으로 waterfall과 같은 방식이지만 다음 함수에 인자를 전달할 수 없음 */
            async.series([

                /* 만다라트 최종목표 수정 */
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

                /* 만다라트 보조목표 수정 */
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
                        /* 루프 내에서 query문 처리 */
                    }
                    console.log("Successfully update mandal sub");
                    updateMandalSubCallback(null);
                },

                /* 만다라트 세부사항 수정 */
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
                /* 에러 발생 또는 위의 모든 함수가 실행되었을 때 */
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


// =====================================
// LOAD DATA FROM MANDAL ===============
// =====================================
exports.mainMandal = function(req, res) {
    /* 만다라트 내용 불러오기 */

    pool.getConnection(function(err, connection) {

        var mandalUltimateData;
        var mandalSubData;
        var mandalDetailData;

        var provider = getProvider(req);
        var authId = provider + req.session.passport.user.id;

        console.log('params : ' + req.params.id);

        async.waterfall([

            /* url을 통하여 얻은 만다라트 ID를 통해 만다라트 최종목표 데이터를 불러옴 */
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

            /* 만다라트 보조목표 불러오기 */
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

            /* 만다라트 세부사항 불러오기 */
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
            /* 에러가 발생하거나 위의 모든 함수가 실행되었을 때 */
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
