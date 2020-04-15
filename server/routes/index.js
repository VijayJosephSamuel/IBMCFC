var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var buyerModel = require('../models/buyersignupmodel');
var sellerModel = require('../models/sellersignupmodel');
var session = require('express-session');
const { check, validationResult } = require('express-validator');
//DB
mongoose.connect('mongodb+srv://vjdb:mongo'+
	'@cluster0-t1hgb.mongodb.net/test?retryWrites'+
	'=true&w=majority',{
	useNewUrlParser : true
});

mongoose.connection.on('error',(err)=>{
	console.log(error);
});

mongoose.connection.once('open',()=>{
	console.log("Success: The connection is working perfectly");

});

//Schema and Model

router.use(session({

	name: 'sid',
	resave : false,
	saveUnitialized: false,
	secret : 'vjissuper',
	cookie: {
		maxAge: 1000*60*10,
		sameSite: true,
		secure: false
	}

}));



//Welcome Route
const redirectLogin = (request, response, next)=>{
	if( !request.session.userId){
		response.redirect('/');
	}else {
		next();
	}
}


const redirectMain = (request, response, next)=>{
	if( request.session.userId){
		response.redirect('/main1');
	}else {
		next();
	}
}


router.get('/',redirectMain,(request, response)=>{
	
	const {userId} = request.session;

	console.log(userId);
	response.render('welcome.ejs');

});

//Routing Login Page



router.get('/login',redirectMain,(request, response)=>{
	
	response.render("buyerlogin.ejs");

});


//Signup Route

router.get('/signup',redirectMain,(request, response)=>{



		
		response.render('buyersellerselect.ejs');

		// if(request.session.signselect == 'seller'){
		// response.render('sellersign.ejs');}

		// if(request.session.signselect == 'buyer'){
		// response.render('buyersign.ejs');}
	
});

router.get('/signup1',redirectMain,(request, response)=>{


		response.render('buyersign.ejs');
});

router.get('/signup2',redirectMain,(request, response)=>{


		response.render('sellersign.ejs');
});



//Main Route

router.get('/main1',redirectLogin,(request, response)=>{

	if(request.session.typesb == 'seller'){
		redirect('/main2');
	}


	else{
			sellerModel.find({

				city: request.session.city

			}, function(err, doc1){
				// response.send(doc1); 
				// response.render('buyeritemdisplay.ejs',{data: {name: 'Sakshi', age : '24', hobbies: ['blogging', 'reading']}});
				response.render('buyeritemdisplay.ejs',{data: doc1, uname : request.session.name, ucity: request.session.city});


			});
			//Improve
		
	//response.render('buyermain.ejs');
	


}
	
});


router.get('/main2',redirectLogin,(request, response)=>{

	if(request.session.typesb == 'buyer'){
		redirect('/main1');
	}


	else{
			// sellerModel.find({

			// 	city: request.session.city

			// }, function(err, doc1){
			// 	// response.send(doc1); 
			// 	// response.render('buyeritemdisplay.ejs',{data: {name: 'Sakshi', age : '24', hobbies: ['blogging', 'reading']}});
			// 	response.render('buyeritemdisplay.ejs',{data: doc1, uname : request.session.name, ucity: request.session.city});


			// });
			//Improve
		
	response.send('Correct Landing');
	


}
	
});



router.get('/booked',redirectLogin,(request, response)=>{

	sellerModel.find({

			shopname : request.session.scheduledshop,
			contact : request.session.scheduledcontact

		}, function(err, doc){
		if(err){
			console.log(err);
					}

		if(doc == null){
			response.send('Incorrect Username and Password'); //Improve
		}

		if(doc != null){
			 // var shoptime = JSON.parse(doc.opentime);
			 // shoptime = JSON.parse(shoptime );
			 console.log(doc);
			response.render('buyerbooked.ejs',{data: doc[0],uname: request.session.name});
		}
	
	});
	//response.render('buyermain.ejs');
	




	
});


//Buyer Login Signup Route

router.post('/buyer', (request,response)=>{


	//request.session.signselect = 'buyer';
	response.redirect('/signup1');
	
});


//Seller Login Singup Route

router.post('/seller', (request,response)=>{



	//request.session.signselect = 'seller';
	response.redirect('/signup2');
	
});

router.post('/logout', redirectLogin, (request,response)=>{

});
//Login Post

router.post('/buyerlogin',[
  // username must be an email
  check('usermail').isEmail(),
  // password must be at least 5 chars long
  check('userpass').isLength({ min: 5 })
], (request, response)=>{

const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }
	let varemail = request.body.usermail;
	let varpassword = request.body.userpass;
 		gemail = varemail;

	buyerModel.find({
		email: varemail,
		userpass: varpassword

	}, function(err, doc){
		if(err){
			console.log(err);
					}

		if(doc[0] == null){
			console.log('No user associated with Buyers'); //Improve
		}

		if(doc[0] != null){
			console.log('He is a Buyer');
			console.log(doc);
			request.session.userId = doc[0]._id;
			request.session.name = doc[0].name;
			request.session.city = doc[0].city;
			request.session.typesb = doc[0].typesb;

			if(request.session.typesb == 'buyer'){
			response.redirect('/main1');
			} //Improve

			if(request.session.typesb == 'seller'){
			response.redirect('/main2');
			}
		}
	
	});



	sellerModel.find({
		email: varemail,
		userpass: varpassword

	}, function(err, doc){
		if(err){
			console.log(err);
					}

		if(doc[0] == null){
			console.log('No user associated with Sellers'); //Improve
		}

		if(doc[0] != null){
			console.log('He is a Seller');
			request.session.userId = doc[0]._id;
			request.session.shopname = doc[0].shopname;
			request.session.city = doc[0].city;
			request.session.typesb = doc[0].typesb;
			console.log(doc);
			if(request.session.typesb == 'buyer'){
			response.redirect('/main1');
			} //Improve

			if(request.session.typesb == 'seller'){
			response.redirect('/main2');
			} //Improve
		}
	
	});
});


router.get('/logout',(request, response)=>{
	request.session.destroy();
	response.redirect('/');


});
//Seller Signup Post

router.post('/sellersignup',(request, response)=>{

		let varshopname = request.body.shopname;
		let varemail = request.body.email;
		let varcity = request.body.city;
		let varlocality = request.body.locality;
		let varpincode = request.body.pincode;
		let varcontact = request.body.contact;
		let varopentime = request.body.opentime;
		let varclosetime = request.body.closetime;
		let varcapacity = request.body.capacity;
		let varslottime = request.body.slottime;
		let varuserpass = request.body.userpass;

		let newDoc = new sellerModel({
			shopname : varshopname,
			email : varemail,
			city : varcity,
			locality : varlocality,
			pincode : varpincode,
			contact : varcontact,
			opentime : varopentime,
			closetime : varclosetime,
			capacity : varcapacity,
			slottime : varslottime,
			userpass : varuserpass,
			typesb : "seller" 

		});

		newDoc.save(function(err, doc ){

			if(err){
				console.log(err);
				response.send('Error when saving data to DB');
			}else{
				console.log('Data Entry Made Smoothly - Console');
				response.redirect('/login');
			}
		});
});




//Buyer Signup Post

router.post('/buyersignup',(request, response)=>{

		let varname = request.body.name;
		let varcity = request.body.city;
		let varemail = request.body.usermail;
		let varuserpass = request.body.userpass;

		let newDoc = new buyerModel({
			name : varname,
			city : varcity,
			email : varemail,
			userpass : varuserpass,
			typesb : "buyer" 

		});

		newDoc.save(function(err, doc ){

			if(err){
				console.log(err);
				response.send('Error when saving data to DB');
			}else{
				console.log('Data Entry Made Smoothly - Console');
				response.redirect('/login');
			}
		});
});




router.post('/buyerbook',(request, response)=>{

		request.session.scheduledshop = request.body.shopname;
		request.session.scheduledcontact = request.body.contact;
		console.log( request.body.shopname);
		response.redirect('/booked'); 
		
});


module.exports = router;