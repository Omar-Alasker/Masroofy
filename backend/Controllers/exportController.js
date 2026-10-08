import { Expense } from "../Models/expenses.js";
import { Income } from "../Models/income.js";


const getTransactionsForExport = async (req, res) => {
    try{
        const userId = req.user._id
        const {startDate, endDate} = req.query
        const filter = {userId}

        if(startDate || endDate) {
            filter.date = {}
            if(startDate) filter.date.$gte = new Date(startDate)
            if(endDate) filter.date.$lte = new Date(endDate)
        }

        const [expenses, income] = await Promise.all([
            Expense.find(filter).populate('categoryId'),
            Income.find(filter).populate('categoryId')   
        ])

        const combined = [
            ...expenses.map((e) => ({...e.toObject(), type: 'expense'})),
            ...income.map((e) => ({...e.toObject(), type: 'income'}))
        ].sort((a,b) => new Date(b.date) - new Date(a.date))

        res.status(200).json({ transactions: combined })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}


export { getTransactionsForExport }