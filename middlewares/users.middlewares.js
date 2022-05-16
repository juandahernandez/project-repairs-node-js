const jwt = require('jsonwebtoken');

// models
const { User } = require('../models/user.model');

// utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.userExists = catchAsync(async (req, res, next) => {
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

exports.protectToken = catchAsync(
  async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError(403, 'Session invalid'));
    }

    const decoded = await jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findOne({
      where: { id: decoded.id, status: 'active' }
    });

    if (!user) {
      return next(
        new AppError(
          403,
          'The owner of this token is no longer available'
        )
      );
    }

    req.sessionUser = user;
    next();
  }
);

exports.protectAccountOwner = catchAsync(
  async (req, res, next) => {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
      return next(
        new AppError(403, 'You do not own this account')
      );
    }

    next();
  }
);
