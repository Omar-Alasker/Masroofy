import { Expense } from "../Models/expenses.js";
import { Income } from "../Models/income.js";
import mongoose from "mongoose";

const getMonthlyChartData = async (req, res) => {
    try{
        const userId = new mongoose.Types.ObjectId(req.user._id)
        const year = parseInt(req.query.year) || new Date().getFullYear()

        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`)
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`)

        const expenseByMonth = await Expense.aggregate([
            {
                $match: {
                    userId,
                    date: {
                        $gte: startOfYear , $lte: endOfYear
                    } 
                }
            },
            {
                $group: {
                    _id: { $month: "$date"},
                    total: { $sum: "$amount"} 
                }
            }
        ])

        const incomeByMonth = await Income.aggregate([
            {
                $match: {
                    userId,
                    date: {
                        $gte: startOfYear, $lte: endOfYear
                    }
                }
            },
            { 
                $group: {
                    _id: { $month: "$date"},
                    total: { $sum: "$amount"}
                } 
            }
        ])

        res.status(200).json({ year, expenseByMonth, incomeByMonth })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}

export { getMonthlyChartData }