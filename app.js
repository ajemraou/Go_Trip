const express = require('express');
const app = express();
const UserRouter = require('./routes/userRoutes');
const TripRouter = require('./routes/TripRoutes');
const AppError = require('./utils/appError');
const ErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const limiter = rateLimit({
	max: 100,
	windowMs: 36000,
	message: 'Too many request from this IP, please try again in a hour!' 
})
// Set Security http headers
app.use(helmet());
// rate limit 
app.use('/api', limiter);
// body pareser
app.use(express.json({
	limit: '10kb'
}));
// data  sanitization against noSQL query 
app.use(mongoSanitize());
// data  sanitization against xss
app.use(xss());

// Preventing Parameter pollution
app.use(hpp({
	whitelist: [
		'duration', "price"
	]
}));

app.use('/api/v1/user', UserRouter);
app.use('/api/v1/trip', TripRouter);

// Error handling
app.all('*', (req, res, next)=>{
	const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
	next(err);
})

app.use(ErrorHandler);

module.exports = app;