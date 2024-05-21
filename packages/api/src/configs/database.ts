import chalk from "chalk";
import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";
import configs from "./configs";

const options: ConnectOptions = {};

export const connectMongoDB = async () => {
  try {
    if (configs.env === "test") return;

    const connection = await mongoose.connect(
      "mongodb://localhost:27017/device-management-system",
      options,
    );
    console.log(
      chalk.green(`MongoDB connected: ${connection.connection.host}`),
    );
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

export const desConnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log(chalk.green(`MongoDB disconnected successfully...`));
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
