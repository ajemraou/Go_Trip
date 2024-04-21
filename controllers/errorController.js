const AppError = require("../utils/appError");
const snedErrorProd = (err, res) => {
	// Operational, trusted error : send message to client
	if (err.isOperational){
		res.status(err.statusCode)
		.json({
			status: err.status,
			message: err.message,
	
		})
	}
	// Programing or other unkown error: don't  leak error details
	else {
		// console.error('ERROR : ', err);
		res.status(500)
		.json({
			status: 'error',
			message: 'Something went wrong!'
		})
	}
}

const sendErrorDev = (err, res) => {
	res.status(err.statusCode)
	.json({
		status : "Fail",
		message : err.message,
		error : err,
		stack: err.stack
	});
}

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path} : ${err.value}`;
	return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
	const message = `Duplicate field value: "${err.keyValue.name}" please use another value!`;
	return new AppError(message, 400);
}


// {
// 	driver: true,
// 	name: 'MongoError',
// 	index: 0,
// 	code: 11000,
// 	keyPattern: { name: 1 },
// 	keyValue: { name: 'starting with this example 2' },
// 	statusCode: 500,
// 	status: 'error'
//   }

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === 'development'){
		sendErrorDev(err, res);
	}
	else if (process.env.NODE_ENV === 'production'){
		let error = {...err};
		if (err.name === 'CastError'){
			error = handleCastErrorDB(error);
		}
		else if ( err.code === 11000 ){
			console.log('Hnadle duplicated fields ');
			error = handleDuplicateFieldsDB(error);
		}
		else if ( err.name === 'ValidationError' ){
			const errors = Object.values(err.errors).map( el => el.message);
			const message = errors.join('; ');
			error = new AppError(`Ivalid input data, ${message}.`, 400);
		}
		snedErrorProd(error, res);
	}

	
}