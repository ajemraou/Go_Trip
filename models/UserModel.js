const mongoose = require('mongoose');
const validator = require('validator');
const bcrpy = require('bcryptjs');
/*	Mongoose starts with a Schema mapping to a MongoDB 
	collection and defining document shape */
const { Schema } = mongoose;
const { model } = mongoose;
const crypto = require('crypto');

const UserSchema = Schema({

	name : {
		type : String,
		require : [true, "A user must have a name"],
		maxlength : [12, 'A user name must have less or equal then 12 characters'],
		minlength : [6, 'A user name must have more or equal then 6 characters'],
	},
	email : {
		type : String,
		require : [true, "A user must have an email"],
		lowercase: true,
		unique: true,
		validate: [validator.isEmail, 'Please provide a valid email']
	
	},
	password : {
		type : String,
		require : [true, "A user must have a password"],
		minlength: [8, 'A password must have more or equal then 8 characters'],
		select : false
	},
	passwordConfirm :{
		type : String,
		require : [true, "A user must confirm the password"],
		validate : { // this only works on save.
			validator: function(el){
				return el === this.password;
			},
			message : "Password and passwordConfirm must be the same"
		}

	},
	photo : {
		type : String,
		// require : [true, "A user must have a photo"],
	},
	role : {
		type : String,
		enum: ['user', 'guide', 'lead-guide', 'admin'],
		default: 'user',

	},
	passwordChangedAt  : {
		type : Date,
	},
	passwordResetToken : String,
	passwordResetExpires : Date,
	active: {
		type : Boolean,
		default : true,
		select : false
	}
});

UserSchema.pre('save', async function(next){
	// only if the passwoed modified 
	if ( this.isModified('password') ){
		this.password = await bcrpy.hash(this.password, 12);
		this.passwordConfirm = undefined;
	}
	return next();
});

UserSchema.pre('save', async function(next){
	// only if the passwoed modified 
	if ( this.isModified('password' || this.isNew ) ){
		this.passwordChangedAt = Date.now();
	}
	return next();
});

UserSchema.pre(/^find/, async function(next){
	this.find({active : {$ne : false}});
	return next();
});

// instance method
UserSchema.methods.correctPassword = async function(candidatePassword, userPassword){
	return await bcrpy.compare(candidatePassword, userPassword);
}

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp){
	if ( this.passwordChangedAt ){
		const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
}

UserSchema.methods.createPasswordResetToken = function(){
	const resetToken = crypto
	.randomBytes(32)
	.toString('hex');

	this.passwordResetToken = crypto
	.createHash('sha256')
	.update(resetToken)
	.digest('hex');

	console.log('Create Password Token ; ');
	this.passwordResetExpires = Date.now() + 3 * 60 * 1000;
	return resetToken;
}


const User = model('User', UserSchema);
module.exports = User;