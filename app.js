import express from "express";
import path from "node:path";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import pool from "./db/pool.js";
import { router } from "./routes/index.js";
import connectPgSimple from "connect-pg-simple";
import { body, validationResult } from "express-validator";

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

// for debugging
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use("/", router);

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

app.get("/member", (req, res) => {
  res.render("member");
});

app.post("/member", async (req, res) => {
  if (req.body.passcode === process.env.PASSCODE) {
    await pool.query("update users set status = 'member' where id = $1", [
      res.locals.currentUser.id,
    ]);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
