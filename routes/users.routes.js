const express = require('express');

// middlewares
const {
  userExists
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
  deleteUser
} = require('../controllers/users.controller');

const router = express.Router();

router.get('/', getAllUsers);

router.get('/:id', userExists, getUserById);

router.post(
  '/',
  createUserValidator,
  validateResult,
  createNewUser
);

router.patch('/:id', userExists, updateUser);

router.delete('/:id', userExists, deleteUser);

module.exports = { usersRouter: router };
