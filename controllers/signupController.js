import passport from "passport";
import pool from "../db/pool";

export const signupController = {
  signupControllerGet: (req, res) => {
    res.render("signup");
  },

  signupControllerPost: async (req, res) => {
    try {
      await pool.query(
        "insert into users (first_name, last_name, username, password) values ($1, $2, $3, $4)",
        [
          req.body.firstName,
          req.body.lastName,
          req.body.username,
          req.body.password,
        ],
      );
      res.redirect("/");
    } catch (error) {
      return next(error);
    }
  },
};
