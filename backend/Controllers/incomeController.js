import { Income, validateIncome, validateUpdateIncome } from '../Models/income.js'

const addIncome = async (req, res) => {
    const { error } = validateIncome(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    try {
        const { categoryId, amount, title, description, date } = req.body
        const income = new Income({
            userId: req.user._id,
            categoryId,
            amount,
            title,
            description,
            date
        })
        await income.save()
        res.status(201).json(income)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const updateIncome = async (req, res) => {
    const { error } = validateUpdateIncome(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message })

    try {
        const income = await Income.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        )

        if (!income) return res.status(404).json({ message: "Income not found!" })
        res.status(200).json(income)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const getIncomes = async (req, res) => {
    try {
        const filter = { userId: req.user._id }
        if(req.query.categoryId) filter.categoryId = req.query.categoryId
        if(req.query.startDate || req.query.endDate){
            filter.date = {}
            if(req.query.startDate) filter.date.$gte = new Date(req.query.startDate)
            if(req.query.endDate) filter.date.$lte = new Date(req.query.endDate)
        }

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [incomes, total] = await Promise.all([
            Income.find(filter).sort({ date: -1 }).skip(skip).limit(limit).populate('categoryId'),
            Income.countDocuments(filter)
        ])

        res.status(200).json({
            incomes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const deleteIncome = async (req, res) => {
    try{
        const income = await Income.findOneAndDelete({_id: req.params.id , userId: req.user._id})
        if(!income) return res.status(404).json({message: 'Income not found!'})
        res.status(200).json({ message: 'Income deleted', income })
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

export { addIncome, updateIncome, getIncomes, deleteIncome }