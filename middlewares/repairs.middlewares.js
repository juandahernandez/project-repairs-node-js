// models
const { Repair } = require('../models/repairs.model');

// utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.repairExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repair.findOne({
    where: { id }
  });

  if (!repair) {
    return next(
      new AppError(404, 'repair not found given that id')
    );
  }

  req.repair = repair;
  next();
});

exports.protectEmployee = catchAsync(
  async (req, res, next) => {
    if (req.sessionUser.role !== 'employee') {
      return next(new AppError(403, 'Access not granted'));
    }

    next();
  }
);
