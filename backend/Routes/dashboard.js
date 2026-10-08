import express from "express"
import auth from "../Middleware/auth.js"
import { getMonthlyChartData } from "../Controllers/dashboardController.js"


const router = express.Router()

router.get('/' , auth, getMonthlyChartData)

export default router

