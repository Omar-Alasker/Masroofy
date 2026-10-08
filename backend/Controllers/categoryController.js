import { Category, validateCategory, validateCategoryUpdate } from "../Models/category.js";
import { Expense } from "../Models/expenses.js";
import { Income } from "../Models/income.js";



const createCategory = async (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })
    
    const {name, color, type, monthlyLimit, icon} = req.body
    try{
        const category = new Category({
            userId: req.user._id,
            name,
            color,
            icon,
            type,
            monthlyLimit
        })

        await category.save()
        res.status(201).json(category)
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const getCategories = async (req, res) => {
    try{
        const filter = {userId: req.user._id}
        if(req.query.type) filter.type = req.query.type
        const categories = await Category.find(filter)
        res.status(200).json(categories)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

const updateCategory = async (req, res) => {
    const { error } = validateCategoryUpdate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })
    
    try{
        const category = await Category.findOneAndUpdate(
            {_id: req.params.id, userId: req.user._id},
            { $set: req.body},
            { new: true , runValidators: true}
        )
        if(!category) return res.status(404).json({message: 'Category not found!'})
        res.status(200).json(category)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

const deleteCategory = async (req, res) => {
    try{
        const inUse = await Promise.all([
            Expense.exists({ categoryId: req.params.id, userId: req.user._id }),
            Income.exists({ categoryId: req.params.id, userId: req.user._id })
        ])

        if (inUse[0] || inUse[1]) {
            return res.status(400).json({ message: "Cannot delete a category that has existing transactions. Reassign or delete those transactions first." })
        }

        const category = await Category.findOneAndDelete({_id: req.params.id, userId: req.user._id})
        if(!category) return res.status(404).json({message: 'Category not found!'})
        res.status(200).json({ message: 'Category deleted', category })
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

export {createCategory, updateCategory, getCategories, deleteCategory}