const User = require("../models/UserModel");
const AppError = require("../utils/appError")

const filterObject = function(body, ...args ){
	let newObj = {};
	Object.keys(body).forEach( el => {
		if (args.includes(el)){
			newObj[el] = body[el];
		}
	})
	return newObj;
}

exports.UpdateMe = async (req, res, next) => {

	const filtredBody = filterObject(req.body, 'name', 'email');
	// 1) create error if user Posts password data
	if ( req.body.password || req.body.passwordConfirm ){
		return next(new AppError('This route is not for pass', 400));
	}
	// 2) Update User Document
	const updaterUser = await User.findByIdAndUpdate(req.user._id, filtredBody, {
		new: true,
		runValidators: true
	});

	res.status(200)
	.json({
		status : "Success",
		message : "successfuly . updated ",
		data : updaterUser,
	})
}

exports.DeleteMe = async(req, res, next) => {
	const updaterUser = await User.findByIdAndUpdate(req.user._id, {active : false}, {
		new: true,
		runValidators: true
	}).select("+active");
	console.log(updaterUser.active);
	res.status(200)
	.json({
		status : "Success",
		message : "successfuly . updated ",
		data : updaterUser,
	})
}

exports.CreateUser = function( req, res ){
	res.status(500)
	.json({
		status : 'failed',
		message : 'route not implemented'
	})
}

exports.GetAllUsers = function( req, res ){
	console.log('GetAllUsers ... ');
	res.status(500)
	.json({
		status : 'failed',
		message : 'route not implemented'
	})
}

/* * * */
exports.GetUser = function( req, res ){
	console.log('GetUser ... ');
	res.status(500)
	.json({
		status : 'failed',
		message : 'route not implemented'
	})
}

exports.UpdateUser = function( req, res ){
	console.log('UpdateUser ... ');
	res.status(500)
	.json({
		status : 'failed',
		message : 'route not implemented'
	})
}

exports.DeleteUser = function( req, res ){
	console.log('DeleteUser ... ');
	res.status(500)
	.json({
		status : 'failed',
		message : 'route not implemented'
	})
}