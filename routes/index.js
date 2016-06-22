exports.route = function (req, res) {
    res.render('index');
}

exports.routeHasId = function (req, res) {
    var account = req.user;
		
	if (typeof account == "undefined") {
		res.render('index', { user : false}); 
	} // 로그인 되어 있지 않을 때
	else {
		if (account.email) { // 사이트 자체 로그인

			res.render('index_session', { user : req.session.passport.user.id });
		} else { // 외부 계정 연동
			console.log("id : " + JSON.stringify(req.session.passport.user));
			res.render('index_session', { user : req.session.passport.user.displayName || {} });			
		}
	} // 로그인 세션이 있을 때
}
