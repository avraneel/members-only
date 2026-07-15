import express from "express";
import path from "node:path";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import { indexRouter } from "./routes/router.js";
import { signupRouter } from "./routes/signupRouter.js";
import { loginRouter } from "./routes/loginRouter.js";
import connectPgSimple from "connect-pg-simple";

const app = express();
const port = process.env.PORT || 3000;
// const pgSession = connectPgSimple(session);

app.set("view engine", "ejs");

// to import css
const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

// because we are using form
app.use(express.urlencoded({ extended: true }));

// TODO 1 use express session
app.use(
  session({
    store: new (connectPgSimple(session))({
      conString: process.env.DB_URL,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 2,
    },
  }),
);

app.use(passport.session());

app.use("/login", loginRouter);
app.post("/signup", signupRouter);

app.get("/", indexRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
