const express = require('express');
const UserRouter = express.Router();
const {
		CreateUser,
		GetAllUsers,
		GetUser,
		UpdateUser,
		DeleteUser,
		UpdateMe
	} = require('../controllers/UserContoller');

const {
	SignUp,
	LogIn,
	resetPassword,
	forgotPassword,
	updatePassword,
	protect
	} = require('../controllers/authController');

UserRouter.post('/signup', SignUp);
UserRouter.post('/login', LogIn);

UserRouter.post('/forgotPassword', forgotPassword);
UserRouter.patch('/resetPassword/:token', resetPassword);
UserRouter.post('/updatePassword', protect, updatePassword);
UserRouter.patch('/updateMe', protect, UpdateMe);

UserRouter.route('/')
.get(GetAllUsers)
.post(CreateUser);

// only for debugin ? ? ? ??  ? ? ? ? ? ?
const UserModel = require('../models/UserModel');
UserRouter.get('/all', async (req, res, next)=>{
	console.log('get all users . . .  ');
	const users = await UserModel.find();
	
	res.status(200)
	.json({
		status : "Success",
		result : users.length,		
		data : users
	})
});

UserRouter.delete('/all', async (req, res, next)=>{
	const users = await UserModel.deleteMany();
	res.status(204)
	.json({
		status : "Success",
		data : users,
	})
});

UserRouter.route('/:id')
.get(GetUser)
.patch(UpdateUser)
.delete(DeleteUser);

module.exports = UserRouter;
