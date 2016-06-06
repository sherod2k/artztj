var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// mongoose.connect('mongodb://localhost/nodeauth'); // This is the original connection which worked
// mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/nodeauth');
// mongodb://<dbuser>:<dbpassword>@ds019893.mlab.com:19893/heroku_f8p2sntg

mongoose.connect('mongodb://heroku_f8p2sntg:rmis3faia7v1remneoterd35p7@ds019893.mlab.com:19893/heroku_f8p2sntg'); // Heroku's connection which works

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	userType: {
		type: String
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileimage:{
		type: String
	},
	filler1: {
		type: String
	},
	filler2: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUsersAll = function(obj, callback){
  User.find(obj, callback);
}

module.exports.getUsersById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
   			newUser.password = hash;
   			newUser.save(callback);
    	});
	});
}

module.exports.DeleteUser = function(id,callback){
	User.findByIdAndRemove(id, callback);
}

// Painting Schemap
/* var PaintingSchema = mongoose.Schema({
	type: {
		type: String
	},
	name: {
		type: String,
		index: true
	},
	price: {
		type: string
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

module.exports.getPaintingsById = function(id, callback){
	Painting.findById(id, callback);
}

module.exports.getPaintingsByPaintingname = function(paintingname, callback){
	var query = {paintingname: paintingname};
	Painting.findOne(query, callback);
}

module.exports.createPainting = function(newPainting, callback){
	newPainting.save(callback);
} */

