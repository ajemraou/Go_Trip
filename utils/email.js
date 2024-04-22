const nodemailer = require("nodemailer");
const { options } = require("../routes/userRoutes");

const sendEmail = async options => {
	// Create a transportor

	// const transportor = nodemailer.createTransport({
	// 	service : 'Gmail',
	// 	auth : {
	// 		user: process.env.EMAIL_USERNAME,
	// 		password : process.env.EMAIL_PASSWORD
	// 	}
	// 	// Activate in gmail "less secure app" option
	// });

	const transportor = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: Number(process.env.EMAIL_PORT),
		auth: {
			user : process.env.EMAIL_USERNAME,
			pass : process.env.EMAIL_PASSWORD
		}
	});

	const mailOptions = {
		from : "ayoub-m <ayoub@email.com>",
		to : options.email,
		subject : options.subject,
		text : options.message
	}

	await transportor.sendMail(mailOptions, (err, info) => {
	
		if ( err ){
			console.log(err);
			throw new Error('SendMail failed');
		}
	});
	
}

module.exports = sendEmail;