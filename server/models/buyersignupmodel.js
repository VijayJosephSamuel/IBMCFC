var mongoose = require('mongoose');


let buyerSchema = new mongoose.Schema({
	name : String,
	city : String,
	email : String,
	userpass : String,
	typesb : String
});


module.exports = mongoose.model('signupbuyer', buyerSchema);

