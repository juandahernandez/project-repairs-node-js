const {
  body,
  validationResult
} = require('express-validator');

// util
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

exports.createUserValidator = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 8 })
    .withMessage(
      'Password must be at least 8 characters long'
    ),
  body('role')
    .isString()
    .withMessage('Role must be a string')
    .notEmpty()
    .withMessage('Role cannot be empty')
];

exports.createRepairValidator = [
  body('date')
    .notEmpty()
    .withMessage('Date cannot be empty')
    .isDate()
    .withMessage('Must be a valid date'),
  body('comments')
    .isString()
    .withMessage('Comments must be a string')
    .notEmpty()
    .withMessage('Comments cannot be empty')
];

exports.validateResult = catchAsync(
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const messages = errors.array().map(({ msg }) => msg);

      const errorMsg = messages.join('. ');

      return next(new AppError(400, errorMsg));
    }
    next();
  }
);
