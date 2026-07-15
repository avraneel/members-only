import bcrypt from "bcryptjs";
import passport from "passport";

export const loginController = {
  loginControllerGet: (req, res) => {
    res.render("login");
  },

  loginControllerPost: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
};
