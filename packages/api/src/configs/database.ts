import chalk from "chalk";
import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";
import configs from "./configs";

const options: ConnectOptions = {
  retryWrites: true,
};

export const connectMongoDB = async () => {
  try {
    if (configs.env === "test") return;
    console.log(configs.database);

    const connection = await mongoose.connect(configs.database.url, options);
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
