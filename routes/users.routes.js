const express = require('express');

// middlewares
const {
  userExists,
  protectToken,
  protectAccountOwner
} = require('../middlewares/users.middlewares');
const {
  createUserValidator,
  validateResult
} = require('../middlewares/validations.middlewares');

// controllers
const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/users.controller');

const router = express.Router();

router.post(
  '/',
  createUserValidator,
  validateResult,
  createNewUser
);

router.post('/login', loginUser);

router.use(protectToken);

router.get('/', getAllUsers);

router.get('/:id', userExists, getUserById);

router.patch(
  '/:id',
  userExists,
  protectAccountOwner,
  updateUser
);

router.delete(
  '/:id',
  userExists,
  protectAccountOwner,
  deleteUser
);

module.exports = { usersRouter: router };
