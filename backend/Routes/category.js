import { createCategory, deleteCategory, updateCategory, getCategories } from "../Controllers/categoryController.js";
import express from 'express'
import auth from '../Middleware/auth.js'

const router = express.Router()


router.post('/' , auth,  createCategory)
router.get('/', auth , getCategories)
router.patch('/:id' , auth , updateCategory)
router.delete('/:id' , auth , deleteCategory)

export default router