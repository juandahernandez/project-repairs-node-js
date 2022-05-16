const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

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
app.use(cors());
app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));
else app.use(morgan('combined'));

const limiter = rateLimit({
  max: 10000,
  windowMs: 1 * 60 * 60 * 1000,
  message: 'Too many requests from this IP'
});

app.use(limiter);

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
