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
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  console.log(res.locals);
  next();
});

app.use("/login", loginRouter);
app.use("/signup", signupRouter);

app.use("/", indexRouter);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
