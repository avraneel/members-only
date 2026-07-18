import bcrypt from "bcryptjs";
import passport from "passport";
import { Router } from "express";
import pool from "../db/pool.js";
import { indexController } from "../controllers/indexController.js";
import { body, validationResult, matchedData } from "express-validator";

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Last name ${lengthErr}`),
  body("confirm-password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Passwords must match`),
];

export const router = new Router();

router.get("/", indexController.indexControllerGet);

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", validateUser, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    console.log("I am here");
    return res.status(400).render("signup", { errors: errors.array() });
  }
  console.log("this should not happening");
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
