import express from "express";
import cors from "cors";
import connectDB from "./db/db.js";
import userRouter from "./Routes/user.js";
import config from "./config/index.js";
import authRouter from './Routes/auth.js'
import categoryRouter from './Routes/category.js'
import incomeRouter from './Routes/income.js'
import expenseRouter from './Routes/expenses.js'
import dashboardRouter from './Routes/dashboard.js'
import exportRouter from './Routes/export.js'

connectDB(config.mongoUri);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/auth", authRouter)
app.use("/category" , categoryRouter)
app.use('/income', incomeRouter)
app.use('/expense', expenseRouter)
app.use('/dashboard', dashboardRouter)
app.use('/export' , exportRouter)

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));