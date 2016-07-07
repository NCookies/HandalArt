exports.route = function (req, res) {
    res.render('index');
}

exports.routeHasId = function (req, res) {
    var account = req.user;
		
	if (typeof account == "undefined") {
		res.render('index', { user : false, message : req.flash('message')}); 
	} // 로그인 되어 있지 않을 때
	else {

		res.render('index_session', { user : req.session.passport.user.displayName || {}, message : false });
		//res.render('index_session', { user : req.session.passport.user });
	} // 로그인 세션이 있을 때
}
