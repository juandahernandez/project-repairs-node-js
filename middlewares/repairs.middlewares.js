// models
const { Repair } = require('../models/repairs.model');

// utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const repairExist = catchAsync(async (req, res, next) => {
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

module.exports = { repairExist };
