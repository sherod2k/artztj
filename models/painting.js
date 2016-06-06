var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');

// mongoose.connect('mongodb://localhost/nodeauth');

// var db = mongoose.connection;

// Painting Schemap
var PaintingSchema = mongoose.Schema({
	type: {
		type: String
	},
	name: {
		type: String,
		index: true
	},
	price: {
		type: String
	},
	description: {
		type: String
	},
	size: {
		type: String
	},
	paintingimage:{
		type: String
	}
});

var Painting = module.exports = mongoose.model('Painting', PaintingSchema);

/* module.exports.getPaintings = function({}, callback){
	var paintings_ = Painting.find({},{}, function(err, docs)
	{res.render('paintings', { posts: docs})};
} */


module.exports.getPaintingsAll = function(obj, callback){
  Painting.find(obj, callback);
}

module.exports.getPaintingsById = function(id, callback){
	Painting.findById(id, callback);
}

module.exports.getPaintingsByPaintingname = function(paintingname, callback){
	var query = {paintingname: paintingname};
	Painting.findOne(query, callback);
}

module.exports.createPainting = function(newPainting, callback){
	newPainting.save(callback);
}

module.exports.FindAndUpdate = function(id, updatedInfoObj, callback){
	Painting.findByIdAndUpdate(id,updatedInfoObj,callback);
}

module.exports.DeletePainting = function(id,callback){
	Painting.findByIdAndRemove(id, callback);
}

/* User.findByIdAndUpdate(4, { username: 'starlord88' }, function(err, user) {
  if (err) throw err;
  console.log(user);
}); */