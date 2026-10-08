import { authUser } from "../Controllers/authController.js";
import express from 'express'

const router = express.Router()


router.post('/', authUser)

export default router