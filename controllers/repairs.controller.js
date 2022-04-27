// utils
const { filterObj } = require('../utils/filterObj');
const { catchAsync } = require('../utils/catchAsync');

// models
const { Repair } = require('../models/repairs.model');

exports.getAllRepairs = catchAsync(async (req, res) => {
  const repairs = await Repair.findAll({
    where: { status: 'pending' }
  });

  res.status(200).json({
    status: 'success',
    data: { repairs }
  });
});

exports.getRepairById = catchAsync(async (req, res) => {
  const { repair } = req;

  res.status(200).json({
    status: 'success',
    data: { repair }
  });
});

exports.createNewDate = catchAsync(async (req, res) => {
  const { date, userId } = req.body;

  const newRepair = await Repair.create({
    date,
    userId
  });

  res.status(201).json({
    status: 'success',
    data: { newRepair }
  });
});

exports.updateRepair = catchAsync(async (req, res) => {
  const { id } = req.params;

  const data = filterObj(req.body, 'status');

  const repair = await Repair.findOne({
    where: { id, status: 'pending' }
  });

  if (!repair) {
    res.status(404).json({
      status: 'error',
      message: 'repair not found given that id'
    });
    return;
  }

  await repair.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteRepair = catchAsync(async (req, res) => {
  const { repair } = req;

  await repair.update({ status: 'cancelled' });

  res.status(204).json({ status: 'success' });
});
