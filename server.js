const fs = require('fs');
const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
const Tour = require('./models/TripModel');

/* For development purposes only */
process.on('uncaughtException', err => {
	console.log('UNCAUGHT EXCEPTION! Shtting down . . . .');
	console.log(err.name, err.message);
	server.close( ()=> {
		process.exit(1);
	})
})

/* 
*	establishing a connection between 
*	our driver and a remote mongodb database
*/
dotenv.config();
mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true
})
.then((con) => {
	console.log('Successfuly connected . . .');

})
.catch(err =>{
	console.error(err);
});

const server = app.listen(process.env.PORT || 3000,'127.0.0.1',(err)=>{
	if (err){
		console.log('error : ', error);
	}
	console.log('listening . . . ');
})


/* For development purposes only */
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
/* For development purposes only */
if (process.argv[2] === '--delete'){
	(async function DeletetData() {
		try{
			await Tour.deleteMany();
			process.exit(0);
		}
		catch(err){
			console.error(err);
			process.exit(1);
		}
	  })();
}
/* For development purposes only */
// listen for unhadledRejection globaly.
process.on('unhandledRejection', err => {
	console.log(`${err.name} : ${err.message}`);
	server.close( () => {
		process.exit(1);
	})
})
