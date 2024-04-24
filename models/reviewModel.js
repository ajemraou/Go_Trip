const {Schema, model} = require('mongoose');

const reviewSchema = new Schema({
	review : {
		type : String,
		require : [true, 'Review can not be empty']
	},
	rating : {
		type : Number,
		min : 0,
		max : 5
	},
	createdAt : {
		type : Date,
		default : Date.now,
	},
	trip : {
		type : Schema.ObjectId,
		ref : 'Tour',
		require : [true, 'Review must belong to a tour']
	},
	author : {
		type : Schema.ObjectId,
		ref : 'User',
		require : [true, 'Review must belong to a user']
	}
},
{
	toJSON : {virtuals : true},
	toObject: {virtuals : true}
});


const Review = model('Review', reviewSchema);
module.exports = Review;
