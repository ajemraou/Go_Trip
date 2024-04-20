const Tour = require('../models/TripModel');
const APIFeatures = require('../utils/apiFeatures');

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
	try{
		const features = new APIFeatures(Tour.find(), req.query);
		features
		.filter()
		.sort()
		.limitFileds()
		.paginate();

		const tours = await features.Query;
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

// aggregation

exports.getTripStats = async (req, res) => {
	try{
		const stats = await Tour.aggregate([
			{
				$match: {ratingsAverage: {$gte : 4.5}}
			},
			{
				$group: {
					_id: { $toUpper : '$difficulty'},
					numTours : {$sum: 1},
					numRating : {$sum : '$ratingsQuantity'},
					avgRating: {$avg: '$ratingsAverage'},
					avgPrice: {$avg : '$price'},
					minPrice: {$min : '$price'},
					maxPrice: {$max : '$price'}
				}
			},
			{
				$sort : {avgPrice: 1}
			}
		]);

		res.status(200)
		.json({
			status : "Success",
			data: stats
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


exports.getMonthlyPlan = async ( req, res) =>{
	try{
		const year = req.params.year * 1;

		const plan = await Tour.aggregate([
			{
				$unwind: '$startDates'
			},
			{
				$match : {
					startDates: {$gte: new Date(`${year}-01-01`), 
					$lte : new Date(`${year}-12-31`)}
				}
			},
			{
				$group:{
					_id: { $month: '$startDates'},
					numTourStarts: {$sum: 1},	
					tours: { $push: '$name' }
				}
			},
			{
				$addFields : {month : '$_id'}
			},
			{
				$sort: {month:1}
			},
			{
				$limit : 6
			}
		]);
	
		console.log('year : ', year);
		res.status(200)
		.json({
			status : 'Success',
			result : plan.length,
			data : plan
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