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

exports.bucketInit = function(req, res) {
    pool.getConnection(function(err, connection) {
		connection.query("select * from bucketlist where member_Id = ?", 
		 req.session.passport.user.id, function(err, rows) {
			if (err) {
				console.error(err);
				connection.rollback(function () {
					console.error('rollback error');
					throw err;
				});
			}

			bucketData = JSON.parse(JSON.stringify(rows));

			console.log(bucketData);
			res.render('bucket_list', {bucketList : bucketData});		
		});
	})
};
