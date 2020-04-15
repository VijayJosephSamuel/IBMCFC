var mongoose = require('mongoose');


let sellerSchema = new mongoose.Schema({
	shopname : String,
	email : String,
	city : String,
	locality : String,
	pincode : Number,
	contact : Number,
	opentime : String,
	closetime : String,
	capacity : Number,
	slottime : Number,
	userpass : String,
	typesb : String
});


module.exports = mongoose.model('sellersignup', sellerSchema);