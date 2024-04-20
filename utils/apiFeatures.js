const Tour = require('../models/TripModel');

class APIFeatures{
	Query;
	ReqQuery;

	constructor( Query, ReqQuery ){
		this.Query = Query;
		this.ReqQuery = ReqQuery;
	}

	filter() {
		// FILTERING
		let queryObj = {...this.ReqQuery};
		const excludeFields = ['page', 'sort', 'limit', 'fields'];
		excludeFields.forEach(el => delete queryObj[el]);
		let queryStr = JSON.stringify(queryObj);
		// mongodb oprtation is like this 
		// { difficulty: 'easy', duration: { $gte: '5' }, page: '3' }
		// but here is our query
		// { difficulty: 'easy', duration: { gte: '5' }, page: '3' }
		// gte gt lte lt
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
		queryObj = JSON.parse(queryStr);
		this.Query = this.Query.find(queryObj);
		return this;
	}

	sort() {
		// SORTING
		if ( this.ReqQuery.sort ) {
			const SortBy = this.ReqQuery.sort.split(',').join(' ');
			this.Query = this.Query.sort(SortBy);
		}
		else {
			this.Query = this.Query.sort('-createdAt');
		}
		return this;
	}

	limitFileds() {
		if ( this.ReqQuery.fields ){
			const Fields = this.ReqQuery.fields.split(',').join(' ');
			thisQuery = this.Query.select(Fields);
		} else {
			this.Query = this.Query.select('-__v');
		}
		return this;
	}

	async paginate() {
		// Pagination
		const page = this.ReqQuery.page * 1 || 1;
		const limit = this.ReqQuery.limit * 1 || 10;
		const skip = (page - 1) * limit;
		this.Query = this.Query.skip(skip).limit(limit);
		if ( this.ReqQuery.page ){
			const numTrips = await Tour.countDocuments();
			if ( numTrips <= skip ){
				throw new Error('Page does not exist');
			}
		}
		return this;
	}

}

module.exports = APIFeatures;