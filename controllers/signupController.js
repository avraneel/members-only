import passport from "passport";
import bcrypt from "bcryptjs";
import pool from "../db/pool.js";

export const signupController = {
  signupControllerGet: (req, res) => {
    res.render("signup");
  },

  signupControllerPost: async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      await pool.query(
        "insert into users (first_name, last_name, email, password) values ($1, $2, $3, $4)",
        [req.body.firstName, req.body.lastName, req.body.email, hashedPassword],
      );
      res.redirect("/");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
};
