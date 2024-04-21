const express = require('express');
const app = express();
const UserRouter = require('./routes/userRoutes');
const TripRouter = require('./routes/TripRoutes');
const AppError = require('./utils/appError');
const ErrorHandler = require('./controllers/errorController');

app.use(express.json());
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/trip', TripRouter);

// Error handling
app.all('*', (req, res, next)=>{
	const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
	next(err);
})

app.use(ErrorHandler);

module.exports = app;