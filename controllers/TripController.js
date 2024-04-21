const Tour = require('../models/TripModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchasync');
const AppError = require('../utils/appError');

exports.CreateTrip = catchAsync( async(req, res, next)=>{
	const tour = await Tour.create(req.body);
	res.status(201)
	.json({
		status : 'Success',
		data : tour
	})
})

exports.GetAllTrips = catchAsync (async ( req, res, next) => {
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
})

exports.GetTrip = catchAsync(async( req, res, next ) => {

	const tour = await Tour.findById(req.params.id);
	if (!tour) {
		return next(new AppError('Trip not found!', 404));
	}
	res.status(200)
	.json({
		status : 'Success',
		data : tour
	})
})

exports.UpdateTrip = catchAsync( async( req, res, next ) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});
	if (!tour) {
		return next(new AppError('Trip not found!', 404));
	}
	res.status(200)
	.json({
		status : 'Success',
		data : tour
	})
})

exports.DeleteTrip = catchAsync(async( req, res, next ) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);
	if (!tour) {
		return next(new AppError('Trip not found!', 404));
	}
	res.status(204)
	.json({
		status: 'Success',
		data: tour
	})
})

// aggregation

exports.getTripStats = catchAsync( async (req, res, next) => {

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
	if (!stats) {
		return next(new AppError('Trip not found!', 404));
	}

	res.status(200)
	.json({
		status : "Success",
		data: stats
	})
})


exports.getMonthlyPlan = catchAsync( async ( req, res, next) =>{

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
	if (!stats) {
		return next(new AppError('Trip not found!', 404));
	}
	res.status(200)
	.json({
		status : 'Success',
		result : plan.length,
		data : plan
	})
})