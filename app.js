const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// routers
const { repairRouter } = require('./routes/repair.routes');
const { usersRouter } = require('./routes/users.routes');

const app = express();

app.use(express.json());

// endponins
app.use('/api/v1/repairs', repairRouter);
app.use('/api/v1/users', usersRouter);

module.exports = { app };
