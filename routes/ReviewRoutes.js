const express = require('express');
const ReviewRoute = express.Router({ mergeParams : true });
const { 
		GetAllReviews, 
		CreateReview 
	} = require('../controllers/ReviewController');

ReviewRoute.route('/')
.get(GetAllReviews)
.post(CreateReview);

module.exports = ReviewRoute;