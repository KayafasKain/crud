var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
var CrudConn = require('./public/js/exchangeLib.js');
var PersonalDB = require('./models/personal');

mongoose.connect('mongodb://localhost/crudapp');
var db = mongoose.connection;

"use strict";

var routes = require('./routes/index');
var users = require('./routes/users');
var crud = require('./routes/crud');


// Init App
var app = express();

app.use(cors());
app.use(require('connect-livereload')());
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(app.router);
// app.use(function(req, res) {
//   // Use res.sendfile, as it streams instead of reading the file into memory.
//   res.sendfile(__dirname + '/public/index.html');
// });

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
		secret: 'secret',
		saveUninitialized: true,
		resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
			var namespace = param.split('.')
			, root    = namespace.shift()
			, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;

	res.statusCode = 200;
	//...
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/crud', crud);




// Set Port
var server = app.listen(3000);
var io = require('socket.io').listen(server);

//listeners
io.on('connection', function (socket) {

	
	var GetPage = 0;

	//send all records to the server
	CrudConn.sendPersonal(socket, PersonalDB, GetPage, function(status) {
		console.log(status);
	});

	//getPages by number
	socket.on("getPage",function( page ){
		GetPage = page.page;
		console.log(" page "+GetPage);
		CrudConn.sendPersonal(socket, PersonalDB, GetPage, function(status) {
			console.log(status);
		});

	});
	console.log(" page "+GetPage);

	//listen on add personal
	socket.on('pushPersonal', function (data) {

		console.log("recieved data: "+data);

		var sendData = new PersonalDB({
			name: data.name,
			fname: data.fname,
			phone: data.phone,
			salary: data.salary
		});

		CrudConn.createPersonal(socket, PersonalDB, sendData,function(status){
			console.log(status);

			CrudConn.sendPersonal(socket, PersonalDB, GetPage, function(status) {
				console.log(status);
			});
		});

	});

	//listen on update personal pushPersonalToUpdate
	socket.on('pushPersonalToUpdate', function (data) {

		console.log("recieved data: "+data);
		//console.log(data.updObject.oldObj);


		var updData = new PersonalDB({
			name: data.updObject.name,
			fname: data.updObject.fname,
			phone: data.updObject.phone,
			salary: data.updObject.salary,
			recID: data.updObject.recID
		});

		console.log("OLD PHONE "+ updData.oldPhone);

		CrudConn.updPersonal(socket, PersonalDB, updData,function(status){
			console.log(status);

			CrudConn.sendPersonal(socket, PersonalDB, GetPage, function(status) {
				console.log(status);
			});
		});

	});

	//listen on update personal pushPersonalToUpdate
	socket.on('PersonalToDelete', function (data) {

		console.log("recieved data: "+data);


		var dltData = new PersonalDB({
			recID: data.dltObject.recID
		});
		
		CrudConn.dltPersonal(socket, PersonalDB, dltData,function(status){
			console.log(status);

			CrudConn.sendPersonal(socket, PersonalDB, GetPage, function(status) {
				console.log(status);
			});
		});

	});

	//listen on search personal pushPersonalToUpdate
	socket.on('search', function (data) {

		console.log(data);


		var srchData = new PersonalDB({
			search: data.search
		});

		console.log(" recieved srch vrd: "+srchData);

		if(data.search == "" || data.search == undefined || data.search == null){
			CrudConn.sendPersonal(socket, PersonalDB, GetPage, function(status) {
				console.log(status);
			});			
		}else{
			
			CrudConn.srchPersonal(socket, PersonalDB, srchData,function(status){
				console.log(status);
			});

		}

	});

});

