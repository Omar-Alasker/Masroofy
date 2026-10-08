import express from "express"
import auth from "../Middleware/auth.js"
import { getTransactionsForExport } from "../Controllers/exportController.js"


const router = express.Router()

router.get('/' , auth, getTransactionsForExport)

export default router

