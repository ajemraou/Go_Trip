const express = require('express');
const TripRouter = express.Router();
const {
		CreateTrip,
		GetAllTrips,
		GetTrip,
		UpdateTrip,
		DeleteTrip
	} = require('../controllers/TripController');

TripRouter.route('/')
.get(GetAllTrips)
.post(CreateTrip);


TripRouter.route('/:id')
.get(GetTrip)
.patch(UpdateTrip)
.delete(DeleteTrip);

module.exports = TripRouter;