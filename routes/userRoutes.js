const express = require('express');
const UserRouter = express.Router();
const {
		CreateUser,
		GetAllUsers,
		GetUser,
		UpdateUser,
		DeleteUser
	} = require('../controllers/UserContoller');

UserRouter.route('/')
.get(GetAllUsers)
.post(CreateUser);


UserRouter.route('/:id')
.get(GetUser)
.patch(UpdateUser)
.delete(DeleteUser);

module.exports = UserRouter;