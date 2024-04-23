const User = require('../models/UserModel');
const catchasync = require('../utils/catchasync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');


const SignToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
}

const CreateSendToken = (user, statusCode, res) => {
	const token = SignToken(user._id);
	const cookieOptions = {
		expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 86400000),
		// secure : true, // only in production with https
		httpOnly:true
	}
	
	res.cookie('jwt', token, cookieOptions);

	res.status(statusCode)
	.json({
		status : "Success",
		token,
		data:{
			user
		}
	})
}

exports.SignUp = catchasync( async ( req, res, next ) => {
	const newUser = await User.create(req.body);
	// const newUser = await User.create({
	// 	name : req.body.name,
	// 	email : req.body.email,
	// 	password : req.body.password,
	// 	passwordConfirm : req.body.passwordConfirm
	// });
	CreateSendToken(newUser, 201, res);
});

exports.LogIn = catchasync( async ( req, res, next ) => {
	const {email, password} = req.body;
	// Check if wmail and password exist
	if (!email || !password )return next(new AppError('Please provide email and password!', 400));
	// Check if the user exist && password correct
	const user = await User.findOne({email}).select('+password');

	if ( !user || !await user.correctPassword(password, user.password ) ){
		return next(new AppError('Incorrect email or password', 401));
	}
	// if everything ok, send token to client
	CreateSendToken(user, 200, res);
});

// const verification =  function(token, secret){
// 	return new Promise(function(resolve, reject){
// 		jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
// 			if (err){
// 				return reject(err);
// 			}
// 			resolve(decoded);
// 		})
// 	})
// }



exports.protect = catchasync( async (req, res, next) => {
	let token;
	// Getting the token and check if it's exist
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token){
		return next(new AppError('You are not logged in! please log in to get access', 401));
	}
	// verification token
	const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const {id, iat} = payload;
	// check if user still exists
	const user = await User.findById(id);
	if ( !user ){
		return next (new AppError('This user does not exist!', 401));
	}
	// Check if user changed password after the token was issued
	user.changedPasswordAfter(iat);
	// if (password was changed ){
	// 	return next(new AppError('User recently changed password! Please log in agin', 401));
	// }
	//GRANT ACCESS TO PROTECTED ROUTE
	req.user = user;
	next();
});


exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if ( !roles.includes(req.user.role) ){
			return next(new AppError('You do not have permission to perform this action', 403));
		}
		next();
	}
}

exports.forgotPassword = async (req, res, next) => {
	// get user based on email
	const user = await User.findOne({email : req.body.email});
	if (!user){
		return next(new AppError('There is no user with email address', 404));
	}
	// generate the random rest token
	const resetToken = user.createPasswordResetToken();
	await user.save( /*{validateBeforeSave : false} */);

	// send it to user email
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
	const message = `Forogot your password ? Sent a PATCH request to this 
	${resetURL} \n if you didn't just igonre this email!`;
	
	try{
		await sendEmail({
			email : user.email,
			subject: 'Your password reset token (valid for 10min)',
			message
		});
		
		res.status(200)
		.json({
			status : 'Success',
			message  : 'Token sent to email!',
		});
	}
	catch( err ){
		console.log(err);
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
		return next(new AppError('There was an error sending the email. Try again later1', 500));
	}

}

exports.resetPassword = async (req, res, next) => {
	console.log('Reset Password');

	// get user based on the token 
	const hashedToken = crypto.createHash('sha256')
	.update(req.params.token)
	.digest('hex');

	// 79369e95b9de16f3c859afe6e9f642fe003c8a44d484b1a2ab0fdcdd36388a85
	console.log('hahedToken : ', hashedToken);

	const user = await User.findOne({
		passwordResetToken : hashedToken,
		passwordResetExpires : { $gt: Date.now()}
	});

	// if token has not expired, and there is user, set the new password
	if ( !user ){
		return next(new AppError('This Token is Invalid or Expired Please Check again!', 401));
	}
	// update Changed Password property for the user
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	user.save();
	// log the user in, send JWT

	CreateSendToken(user, 200, res);
}

exports.updatePassword = catchasync( async(req, res, next) => {
	const { oldPassword, password, passwordConfirm } = req.body;

	// Get the user from the collection 
	const user = await User.findById(req.user._id).select('+password');
	// Check if the posted password is correct
	if ( !await user.correctPassword(oldPassword, user.password) ){
		return next(new AppError('Wrong password, Please try agin!', 401));
	}
	//	if so, update the password
	user.password = password;
	user.passwordConfirm = passwordConfirm;
	await user.save();
	// lod user in, send JWT
	CreateSendToken(user, 200, res);
});