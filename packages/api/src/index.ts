import chalk from "chalk";
import cors from "cors";
import express from "express";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  return res.json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(chalk.green(`Server listening on port ${PORT}`));
});
