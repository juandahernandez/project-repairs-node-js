const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    include: [{ model: Repair }],
    attributes: { exclude: ['password'] }
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

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role
    });

    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: { newUser }
    });
  }
);

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const data = filterObj(req.body, 'name', 'email');

  await user.update({ ...data });

  res.status(204).json({ status: 'success' });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'delete' });

  res.status(204).json({ status: 'success' });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email, status: 'active' }
  });

  if (
    !user ||
    !(await bcrypt.compare(password, user.password))
  ) {
    return next(
      new AppError(400, 'Credentials are invalid')
    );
  }

  const token = await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { token, user }
  });
});
