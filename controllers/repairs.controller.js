// utils
const { filterObj } = require('../utils/filterObj');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

// models
const { Repair } = require('../models/repairs.model');
const { User } = require('../models/user.model');

exports.getAllRepairs = catchAsync(
  async (req, res, next) => {
    const repairs = await Repair.findAll({
      where: { status: 'pending' },
      include: [{ model: User }]
    });

    res.status(200).json({
      status: 'success',
      data: { repairs }
    });
  }
);

exports.getRepairById = catchAsync(
  async (req, res, next) => {
    const { repair } = req;

    res.status(200).json({
      status: 'success',
      data: { repair }
    });
  }
);

exports.createNewDate = catchAsync(
  async (req, res, next) => {
    const { date, computerNumber, comments, userId } =
      req.body;

    const newRepair = await Repair.create({
      date,
      computerNumber: Math.floor(Math.random() * 1000),
      comments,
      userId
    });

    res.status(201).json({
      status: 'success',
      data: { newRepair }
    });
  }
);

exports.updateRepair = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;

    const data = filterObj(req.body, 'status');

    const repair = await Repair.findOne({
      where: { id, status: 'pending' }
    });

    if (!repair) {
      return next(
        new AppError(404, 'repair not found given that id')
      );
    }

    await repair.update({ ...data });

    res.status(204).json({ status: 'success' });
  }
);

exports.deleteRepair = catchAsync(
  async (req, res, next) => {
    const { repair } = req;

    await repair.update({ status: 'cancelled' });

    res.status(204).json({ status: 'success' });
  }
);
