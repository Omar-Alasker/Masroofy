import { addExpense,deleteExpense,updateExpense,getExpenses } from "../Controllers/expensesController.js";
import express from 'express'
import auth from '../Middleware/auth.js'

const router = express.Router()


router.post('/' , auth, addExpense)
router.get('/', auth, getExpenses)
router.delete('/:id', auth, deleteExpense)
router.patch('/:id', auth, updateExpense)

export default router