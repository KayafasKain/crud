var express = require('express');
var router = express.Router();

cors = require('cors');

// Get Homepage
router.get('/', cors(), function(req, res){
	res.statusCode = 200;
	//...
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.render('crud');
});

router.get('/create', cors(), function(req, res){
	res.render('create');
});

// router.get('/', ensureAuthenticated, function(req, res){
// 	res.render('index');
// });

// function ensureAuthenticated(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	} else {
// 		//req.flash('error_msg','You are not logged in');
// 		res.redirect('/users/login');
// 	}
// }

module.exports = router;