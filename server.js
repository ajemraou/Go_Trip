const app = require('./app');
const PORT = 8008;

app.listen(PORT,'127.0.0.1',(err)=>{
	if (err){
		console.log('error : ', error);
	}
	console.log('listening . . . ');
})