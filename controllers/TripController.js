const Tour = require('../models/TripModel');

exports.CreateTrip = async function( req, res ){
	try{
		const tour = await Tour.create(req.body);
		res.status(201)
		.json({
			status : 'Success',
			data : tour
		})
	}
	catch(err){
		res.status(400)
		.json({
			status: 'Fail',
			message: err
		})
	}
}

exports.GetAllTrips = async function( req, res ){
	console.log(req.query);
	try{
		let queryObj = {...req.query};
		const excludeFields = ['page', 'sort', 'limit', 'fields'];
		excludeFields.forEach(el => delete queryObj[el]);
		
		let queryStr = JSON.stringify(queryObj);
		// mongodb oprtation is like this 
		// { difficulty: 'easy', duration: { $gte: '5' }, page: '3' }
		// but here is our query
		// { difficulty: 'easy', duration: { gte: '5' }, page: '3' }
		// gte gt lte lt
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		queryObj = JSON.parse(queryStr);
		const tours = await Tour.find(queryObj);
	
		res.status(200)
		.json({
			status : 'Success',
			result : tours.length,
			data : tours
		})
	}
	catch( err ){
		res.status(400)
		.json({
			status : 'Fail',
			message : err
		})
	}
}

exports.GetTrip = async function( req, res ){

	try{
		const tour = await Tour.findById(req.params.id);
		res.status(200)
		.json({
			status : 'Success',
			data : tour
		})
	}
	catch(err){
		res.status(404)
		.json({
			status: 'Fail',
			message : 'Trip not found'
		})
	}
}

exports.UpdateTrip = async function( req, res ){
	try{
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});
		res.status(200)
		.json({
			status : 'Success',
			data : tour
		})
	}
	catch(err){
		res.status(400)
		.json({
			status : 'Fail',
			message: err
		})
	}

}

exports.DeleteTrip = async function( req, res ){
	try{
		const tour = await Tour.findByIdAndDelete(req.params.id);
		res.status(204)
		.json({
			status: 'Success',
			data: tour
		})
	}
	catch(err){
		res.status(400)
		.json({
			status : 'Fail',
			message: err
		})
	}
}