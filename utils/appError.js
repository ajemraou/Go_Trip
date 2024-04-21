class AppError extends Error {
	constructor(message, statusCode){
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
		this.isOperational = true;

		//The log_stack frame is including the constructor and 
		//all cb before it.
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;