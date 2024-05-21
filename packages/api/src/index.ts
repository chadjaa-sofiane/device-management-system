import configs from "@/configs/configs";
import { connectMongoDB, desConnectMongoDB } from "@/configs/database";
import chalk from "chalk";
import cors from "cors";
import express from "express";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

await connectMongoDB();

app.get("/", (_, res) => {
  return res.json({ message: "Hello, World!" });
});

app.listen(configs.port, () => {
  console.log(
    chalk.green(`Server listening on port ${configs.hostname}:${configs.port}`),
  );
});

process.on("SIGINT", () => {
  desConnectMongoDB();
  console.log(chalk.red("Server shutting down..."));
  process.exit(0);
});

process.on("SIGTERM", () => {
  desConnectMongoDB();
  console.log(chalk.red("Server shutting down..."));
  process.exit(0);
});
