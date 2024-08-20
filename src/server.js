import express from 'express'
import dotenv from "dotenv";
import cors from 'cors'
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js"
import followRouter from "./routes/followRoutes.js";


dotenv.config();

connectDB();

const app = express();

app.use(cors())


//Habilitar la lectura de json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRouter);
app.use("/api/follow", followRouter);

export default app;