var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');



// Personal Schema
var PersonalSchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	},
	fname: {
		type: String
	},
	phone: {
		type: String
	},
	salary: {
		type: String
	},
	recID: {
		type: String
	},
	search: {
		type: String
	}	
});

PersonalSchema.plugin(mongoosePaginate);

var Personal = module.exports = mongoose.model('Personal', PersonalSchema);

module.exports.PaginatedData = function(pageN, callback){
	var page = parseInt(pageN, 10)*10;
	var query   = {};
	var options = {
	    select:   'name fname phone salary',
	    sort:     { Salary: -1 },
	    populate: 'Name',
	    lean:     true,
	    offset:   page, 
	    limit:    10
	};
	 
	Personal.paginate(query, options).then(function(result) {
	    callback(result);
	});
}

module.exports.createPersonal = function(newPersonal, callback){
	newPersonal.save(newPersonal);

	var res = "created...";
	callback(res);
}

module.exports.updPersonal = function( updObject ){
	console.log("nm "+updObject.name);
	console.log("fnm "+updObject.fname);
	console.log("phn "+updObject.phone);
	console.log("slr "+updObject.salary);
	console.log("ID  "+updObject.recID);

	Personal.update({_id: updObject.recID}, 
		{ 
			$set: 
				{ 
					name: updObject.name,
					fname: updObject.fname,
					phone: updObject.phone,
					salary: updObject.salary 
				}
		}, 

	function(err, result){
	    console.log("Updated successfully");
	    console.log(result);
	});

}

module.exports.dltPersonal = function( dltObject ){
	Personal.remove({_id: dltObject.recID},function(err){
		if(err){
			console.log(err);
		} 
	});
}

module.exports.srchPersonal = function( srchObject, callback ){
	console.log("srch vrd  " + srchObject.search);
	Personal.find({name: srchObject.search}, function(err, docs){
		if(err) throw err;
		callback(docs);

		if(docs.length == 0){
			Personal.find({fname: srchObject.search}, function(err, docs){
				if(err) throw err;
				callback(docs);

				if(docs.length == 0){
					Personal.find({phone: srchObject.search}, function(err, docs){
						if(err) throw err;
						callback(docs);

						if(docs.length == 0){
							Personal.find({salary: srchObject.search}, function(err, docs){
								if(err) throw err;
								callback(docs);

							});
						}
					});
				}
			});
		}

	});

}



