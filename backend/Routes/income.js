import { addIncome, updateIncome, deleteIncome, getIncomes } from "../Controllers/incomeController.js";
import express from 'express'
import auth from '../Middleware/auth.js'

const router = express.Router()

router.post('/', auth, addIncome)
router.get('/', auth, getIncomes)
router.patch('/:id', auth, updateIncome)
router.delete('/:id', auth, deleteIncome)

export default router