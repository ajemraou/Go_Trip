const mongoose = require('mongoose');
const validator = require('validator');
/*	Mongoose starts with a Schema mapping to a MongoDB 
	collection and defining document shape */
const { Schema } = mongoose;
const { model } = mongoose;

/* Creating Our Schema definition */
const TripSchema = new mongoose.Schema(
	{
	  name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
		trim: true,
		maxlength: [40, 'A tour name must have less or equal then 40 characters'],
		minlength: [10, 'A tour name must have more or equal then 10 characters']
		// validate: [validator.isAlpha, 'Tour name must only contain characters']
	  },
	  slug: String,
	  duration: {
		type: Number,
		required: [true, 'A tour must have a duration']
	  },
	  maxGroupSize: {
		type: Number,
		required: [true, 'A tour must have a group size']
	  },
	  difficulty: {
		type: String,
		required: [true, 'A tour must have a difficulty'],
		enum: {
		  values: ['easy', 'medium', 'difficult'],
		  message: 'Difficulty is either: easy, medium, difficult'
		}
	  },
	  ratingsAverage: {
		type: Number,
		default: 4.5,
		min: [1, 'Rating must be above 1.0'],
		max: [5, 'Rating must be below 5.0']
	  },
	  ratingsQuantity: {
		type: Number,
		default: 0
	  },
	  price: {
		type: Number,
		required: [true, 'A tour must have a price']
	  },
	  priceDiscount: {
		type: Number,
		validate: { // Custom validator
		  validator: function( val ) {
			// this only points to current doc on NEW document creation
			// so this function do not work with update document
			return val < this.price;
		  },
		  message: 'Discount price ({VALUE}) should be below regular price'
		}
	  },
	  summary: {
		type: String,
		trim: true,
		required: [true, 'A tour must have a description']
	  },
	  description: {
		type: String,
		trim: true
	  },
	  imageCover: {
		type: String,
		required: [true, 'A tour must have a cover image']
	  },
	  images: [String],
	  createdAt: {
		type: Date,
		default: Date.now(),
		select: false
	  },
	  startDates: [Date],
	  secretTour: {
		type: Boolean,
		default: false
	  }
	},
	{
	  toJSON: { virtuals: true },
	  toObject: { virtuals: true }
	}, {
		toJSON: {virtuals: true},
		toObject: {virtuals: true},
	});

 // Virtual Properties
TripSchema.virtual('durationWeeks').get(function(){
	return this.duration / 7;
});

// Document MIDDLEWARE : run before .save() and create()
TripSchema.pre('save', function(next){
	console.log('from pre middlware');
	// console.log(this);
	// this document
	next();
})

// Document MIDDLEWARE : run before .save() and create()
TripSchema.post('save', function(doc, next){
	console.log('document created with success');
	
	next();
})


// QUERY MIDDLEWARE
TripSchema.pre(/^find/, function(next){
	// this = query
	 this.find({secretTour: {$ne : true}});
	next();
})

// AGGREGATION MIDDLEWARE
TripSchema.pre('aggregate', function(next){
	console.log(this);
	next();
})


/* Converting Our Schema into a model */
const Tour = model('Tour', TripSchema);

module.exports = Tour;