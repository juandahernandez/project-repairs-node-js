const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//controllers
const {
  globalErrorHandler
} = require('./controllers/error.controller');

// routes
const { repairRouter } = require('./routes/repair.routes');
const { usersRouter } = require('./routes/users.routes');

//utils
const { AppError } = require('./utils/appError');

const app = express();

app.use(express.json());

// endponins
app.use('/api/v1/repairs', repairRouter);
app.use('/api/v1/users', usersRouter);

app.use('*', (req, res, next) => {
  next(
    new AppError(
      404,
      `${req.originalUrl} not found in this server.`
    )
  );
});

app.use(globalErrorHandler);

module.exports = { app };
