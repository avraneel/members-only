import express from "express";
import { indexRouter } from "./routes/router.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
