const express = require('express');
const app = express();
const UserRouter = require('./routes/userRoutes');
const TripRouter = require('./routes/TripRoutes');


app.use(express.json());
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/trip', TripRouter);

module.exports = app;