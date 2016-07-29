

module.exports.sendPersonal = function( socket, PersonalDB, page, callback ){
	var res = "res";
	PersonalDB.PaginatedData(page,function(result){
		
		socket.emit('outputPersonal', result);
	});
	

	var status = "complete";
	callback(status);
}
//createPersonal
module.exports.createPersonal = function( socket, PersonalDB, Personal, callback ){
	PersonalDB.createPersonal(Personal, function(status){
		console.log(status);
	});
	var status = "complete: create";
	callback(status);
}
//updPersonal
module.exports.updPersonal = function( socket, PersonalDB, Personal, callback ){
	PersonalDB.updPersonal(Personal, function(status){
		console.log(status);
	});
	var status = "complete: update";
	callback(status);
}
//updPersonal
module.exports.dltPersonal = function( socket, PersonalDB, Personal, callback ){
	PersonalDB.dltPersonal(Personal, function(status){
		console.log(status);
	});
	var status = "complete: remove";
	callback(status);
}
//searchPersonal
module.exports.srchPersonal = function( socket, PersonalDB, Personal, callback ){
	PersonalDB.srchPersonal(Personal, function(docs){
		console.log("srch doc  " + docs);
		socket.emit('searchResult', docs);
	});
	var status = "complete: search";
	callback(status);
}