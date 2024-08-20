
import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(colors.cyan.bold(`MongoDB conectado en: ${url}`));
  } catch (error) {
    console.log(error);
    exit(1);
  }
};
