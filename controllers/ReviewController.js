const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchasync');

exports.CreateReview = catchAsync (async function(req, res, next){
	
	// 
	if (!req.body.trip){
		req.body.trip = req.params.TripId;
	}
	if (!req.body.user){
		req.body.user = req.user;
	}
	const bodyreview = {
		review : req.body.review,
		rating : req.body.rating,
		trip : req.body.trip,
		author : req.body.author
	}
	const review = await Review.create(bodyreview);

	res.status(201)
	.json({
		status : "Success",
		data: review
	})
});

exports.GetAllReviews = catchAsync( async function(req, res, next){
	let filter = {};
	if (req.params.TripId) filter = { trip : req.params.TripId};

	const reviews = await Review.find(filter)
	.populate('author')
	.populate('trip');

	res.status(200)
	.json({
		status : "Success",
		result : reviews.length,
		data: reviews
	})
});