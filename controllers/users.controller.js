// utils
const { filterObj } = require('../utils/filterObj');
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

// models
const { User } = require('../models/user.model');
const { Repair } = require('../models/repairs.model');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    include: [{ model: Repair }]
  });

  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.createNewUser = catchAsync(
  async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      status: 'success',
      data: { newUser }
    });
  }
);

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const data = filterObj(req.body, 'name', 'email');

  const user = await User.findOne({
    where: { id, status: 'active' }
  });

  if (!user) {
    return next(
      new AppError(404, 'User not found given that id')
    );
  }

  await user.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});
