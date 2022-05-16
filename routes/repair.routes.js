const express = require('express');

// middlewares
const {
  repairExist,
  protectEmployee
} = require('../middlewares/repairs.middlewares');
const {
  createRepairValidator,
  validateResult
} = require('../middlewares/validations.middlewares');

const {
  protectToken
} = require('../middlewares/users.middlewares');

const {
  getAllRepairs,
  getRepairById,
  createNewDate,
  updateRepair,
  deleteRepair
} = require('../controllers/repairs.controller');

const router = express.Router();

router.use(protectToken);

router.post(
  '/',
  createRepairValidator,
  validateResult,
  createNewDate
);

router.use(protectEmployee);

router.get('/', getAllRepairs);

router.get('/:id', repairExist, getRepairById);

router.patch('/:id', repairExist, updateRepair);

router.delete('/:id', repairExist, deleteRepair);

module.exports = { repairRouter: router };
