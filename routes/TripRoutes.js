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
	
TripRouter.route('/trip-stats')
.get(getTripStats);

TripRouter.route('/monthly-plan/:year')
.get(getMonthlyPlan)

TripRouter.route('/')
.get(GetAllTrips)
.post(CreateTrip);


TripRouter.route('/:id')
.get(GetTrip)
.patch(UpdateTrip)
.delete(DeleteTrip);

module.exports = TripRouter;