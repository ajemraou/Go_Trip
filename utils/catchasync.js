const catchAsync = fn => {
	//Save this callback to the exports 
	//object so that it can be used later
	return (req, res, next) =>{
		fn(req, res, next).catch(next);
	}
}

module.exports = catchAsync;