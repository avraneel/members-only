import express from "express";
import { indexRouter } from "./routes/router.js";
import { loginRouter } from "./routes/loginRouter.js";
import { signupRouter } from "./routes/signupRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
