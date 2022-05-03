// models
const { User } = require('../models/user.model');

// utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id, status: 'active' }
  });

  if (!user) {
    return next(
      new AppError(404, 'User not found given that id')
    );
  }

  req.user = user;
  next();
});

module.exports = { userExists };
