import bcrypt from "bcryptjs";
import passport from "passport";
import { Router } from "express";
import pool from "../db/pool.js";
import { indexController } from "../controllers/indexController.js";

export const router = new Router();

router.get("/", indexController.indexControllerGet);

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await pool.query(
    "insert into users (first_name, last_name, email, password, status) values ($1, $2, $3, $4, $5)",
    [
      req.body.firstName,
      req.body.lastName,
      req.body.username,
      hashedPassword,
      req.body.admin || "user",
    ],
  );
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/delete", async (req, res) => {
  await pool.query("delete from messages where id = $1", [req.body.msgId]);
  console.log(req.body);
  res.redirect("/");
});
