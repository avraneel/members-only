import express from "express";
import path from "node:path";
import passport from "passport";
import session from "express-session";
import "./controllers/passport.js";
import { indexRouter } from "./routes/router.js";
import { loginRouter } from "./routes/loginRouter.js";
import { signupRouter } from "./routes/signupRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
