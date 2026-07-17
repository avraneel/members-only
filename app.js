import express from "express";
import path from "node:path";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import pool from "./db/pool.js";
import { indexRouter } from "./routes/router.js";
import { signupRouter } from "./routes/signupRouter.js";
import { loginRouter } from "./routes/loginRouter.js";
import connectPgSimple from "connect-pg-simple";

const app = express();
const port = process.env.PORT || 3000;
const pgSession = connectPgSimple(session);

app.set("view engine", "ejs");

// to import css
const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

// because we are using form
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new pgSession({
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

app.get("/submit", (req, res) => {
  console.log(req.query);
  res.send("/");
});

app.post("/submit", async (req, res, next) => {
  if (!res.locals.currentUser) {
    res.redirect("/");
  }
  const query = req.query;
  const msg = req.body.message;
  const { rows } = await pool.query("select * from users where id = $1", [
    res.locals.currentUser.id,
  ]);
  const userId = rows[0].id;
  await pool.query(
    "insert into messages (user_id, timestamp, text) values ($1, $2, $3)",
    [userId, new Date(), req.body.message],
  );
  const { rows: messages } = await pool.query(
    "select * from users join messages on messages.user_id = users.id;",
  );
  messages.forEach((item) => {
    item.timestamp = item.timestamp.toLocaleString();
  });
  res.render("index", { messages: messages });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
