const fs = require('fs');
const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
const Tour = require('./models/TripModel');

dotenv.config();
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true
})

.then((con) => {
	console.log('Successfuly connected . . .');

})
.catch( (err) => {
	console.log('Error : ', err);
});

app.listen(process.env.PORT || 3000,'127.0.0.1',(err)=>{
	if (err){
		console.log('error : ', error);
	}
	console.log('listening . . . ');
})


// For development purposes only
if (process.argv[2] === '--import'){
	(async function ImportData() {
		const toursContent = fs.readFileSync('./dev-data/tours.json', 'utf-8');
		const Tours = JSON.parse(toursContent);
		try{
			await Tour.insertMany(Tours);
			process.exit(0);
		}
		catch(err){
			console.error(err);
			process.exit(1);
		}
	  })();
}

if (process.argv[2] === '--delete'){
	(async function DeletetData() {
		try{
			console.log('delete many');
			await Tour.deleteMany();
			process.exit(0);
		}
		catch(err){
			console.error(err);
			process.exit(1);
		}
	  })();
}
