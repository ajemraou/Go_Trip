const express = require('express');
const TripRouter = express.Router();
const {
		CreateTrip,
		GetAllTrips,
		GetTrip,
		UpdateTrip,
		DeleteTrip,
		getTripStats,
		getMonthlyPlan
	} = require('../controllers/TripController');
const {	
		protect,
		restrictTo
	} = require('../controllers/authController');

const ReviewRouter = require('../routes/ReviewRoutes');

TripRouter.use('/:TripId/review', ReviewRouter);

TripRouter.route('/trip-stats')
.get(getTripStats);

TripRouter.route('/monthly-plan/:year')
.get(getMonthlyPlan)

TripRouter.route('/')
.get(protect, GetAllTrips)
.post(protect, CreateTrip);


TripRouter.route('/:id')
.get(protect, GetTrip)
.patch(protect, UpdateTrip)
.delete(protect, restrictTo('admin', 'lead-guide'), DeleteTrip);

module.exports = TripRouter;