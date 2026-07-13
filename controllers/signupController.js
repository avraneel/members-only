import passport from "passport";
import pool from "../db/pool.js";

export const signupController = {
  signupControllerGet: (req, res) => {
    res.render("signup");
  },

  signupControllerPost: async (req, res, next) => {
    try {
      console.log(req.body);
      await pool.query(
        "insert into users (first_name, last_name, email, password) values ($1, $2, $3, $4)",
        [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          req.body.password,
        ],
      );
      res.redirect("/");
    } catch (error) {
      return next(error);
    }
  },
};
