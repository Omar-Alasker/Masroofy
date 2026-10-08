import {Expense, validateExpense, validateUpdateExpense} from '../Models/expenses.js'


const addExpense = async (req, res) => {
    const { error } = validateExpense(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    try{
        const {amount, categoryId, description, title, date} = req.body
        const expense = new Expense({
            userId: req.user._id,
            categoryId,
            amount,
            date,
            description,
            title
        })
        await expense.save()
        res.status(201).json(expense)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

const updateExpense = async (req, res) => {
    const { error } = validateUpdateExpense(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        )

        if (!expense) return res.status(404).json({ message: "Expense not found!" })
        res.status(200).json(expense)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const getExpenses = async (req, res) => {
    try{
        const filter = { userId: req.user._id }
        if(req.query.categoryId) filter.categoryId = req.query.categoryId
        if(req.query.startDate || req.query.endDate) {
            filter.date = {}
            if(req.query.startDate) filter.date.$gte = new Date(req.query.startDate)
            if(req.query.endDate) filter.date.$lte = new Date(req.query.endDate)
        }

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit 

        const [expenses, total] = await Promise.all([
            Expense.find(filter).sort({date: -1}).skip(skip).limit(limit).populate('categoryId'),
            Expense.countDocuments(filter)
        ])

        res.status(200).json({
            expenses,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

const deleteExpense = async (req, res) => {
    try{
        const expense = await Expense.findOneAndDelete({_id: req.params.id , userId: req.user._id})
        if(!expense) return res.status(404).json({message: 'Expense not found!'})
        res.status(200).json({ message: 'Expense deleted', expense })
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

export {addExpense, deleteExpense, updateExpense, getExpenses}