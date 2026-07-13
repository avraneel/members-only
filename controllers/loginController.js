export const loginController = {
  loginControllerGet: (req, res) => {
    res.render("login");
  },

  loginControllerPost: (req, res) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureMessage: true,
    });
  },
};
