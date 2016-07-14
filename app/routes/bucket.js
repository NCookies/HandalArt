var mysql = require('mysql');

var pool = mysql.createPool({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : 'ehehgks!!123',
    database:'handalart',
    connectionLimit:20,
    waitForConnections:false
});

var async = require('async');

var getProvider = function(req) {
    var provider;

	console.log("[session] : " + JSON.stringify(req.session));
    console.log('[provider] : ' + req.session.passport.user.provider);

    if (req.session.passport.user.provider == undefined) {
        provider = "local:";
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
}



exports.bucketInit = function(req, res) {
	var provider = getProvider(req);
	var authId = provider + req.session.passport.user.id;

	console.log('[auth] : ' + authId);


	pool.getConnection(function(err, connection) {
		var provider = getProvider(req);
		var authId = provider + req.session.passport.user.id;

		console.log('[auth] : ' + authId);

		connection.query('SELECT * FROM bucketlist where member_AuthId = ?',
		[authId], function(err, rows) {
			console.log(JSON.stringify(rows));

			res.render('bucket_list', { buckets: JSON.stringify(rows) });
		});

		connection.release();
	});
};


exports.addBucket = function(req, res) {

	var provider = getProvider(req);
	var authId = provider + req.session.passport.user.id;

	console.log('[auth] : ' + authId);


	pool.getConnection(function(err, connection) {
		async.waterfall([
			function getBucketId(getBucketIdCallback) {
                connection.query('SELECT MAX(bucketlist_Id) FROM bucketlist WHERE member_AuthId = ?',
                [authId], function(err, rows) {
                    bucketId = Number(JSON.stringify(rows[0]).match(/\d+/)[0]) + 1;

					console.log(bucketId);

                    if (err) {
                        getBucketIdCallback(err);
                    } else {
						console.log("Successfully get bucketlist id");
                        getBucketIdCallback(null, bucketId);
                    }
                });
            },
			function insertBucket(bucketId, insertBucketCallBack) {
				console.log("[Insert Bucketlist] : " + JSON.stringify(req.body));

				connection.query('INSERT INTO bucketlist VALUES (?, ?, ?, ?, ?, ?)',
				[authId, bucketId, req.body.goal, req.body.date,
				req.body.isComp, req.body.description],
				function(err, rows) {
					if (err) {
						insertBucketCallBack(err);
					} else {
						console.log("Successfully insert bucketlist");
						insertBucketCallBack(null, 'done');
					}
				});
			}
		],
		function(err, result) {
			if (err) {
				console.log(err);
				connection.release();
				res.render('bucket_list', { buckets : false });
			}
			console.log("result : " + result);
		});
	});
}


exports.editBucket = function(req, res) {

	var provider = getProvider(req);
	var authId = provider + req.session.passport.user.id;

	console.log('[auth] : ' + authId);


	pool.getConnection(function(err, connection) {

		async.waterfall([

			function getBucketId(getBucketIdCallback) {
                connection.query('SELECT MAX(bucketlist_Id) FROM bucketlist WHERE member_AuthId = ?',
                [authId], function(err, rows) {
                    bucketId = Number(JSON.stringify(rows[0]).match(/\d+/)[0]) + 1;

					console.log(bucketId);

                    if (err) {
                        getBucketIdCallback(err);
                    } else {
						console.log("Successfully get bucketlist id");
                        getBucketIdCallback(null, bucketId);
                    }
                });
            },

			function updateBucket(bucketId, updateBucketCallBack) {

				console.log("[Update Bucketlist] : " + JSON.stringify(req.body));

				var query = 'UPDATE bucketlist SET bucketlist_Goal = ?, ' +
				'bucketlist_Limit = ?, bucketlist_Is_achieved = ?, ' +
				'bucketlist_Description = ? WHERE member_AuthId = ? AND bucketlist_Id = ?'

				connection.query(query,
				[req.body.goal, req.body.date, req.body.isComp, req.body.description,
				authId, bucketId], function(err, rows) {
					if (err) {
						updateBucketCallBack(err);
					} else {
						console.log("Successfully update bucketlist");
						updateBucketCallBack(null, 'done');
					}
				});
			}
		],
		function(err, result) {
			if (err) {
				console.log(err);
				connection.release();
				res.render('bucket_list', { buckets : false });
			}
			console.log("result : " + result);
		});
	});
}

exports.deleteBucket = function(req, res) {

}
