import passport from "passport";
import pool from "../db/pool.js";
import LocalStrategy from "passport-local";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("hit");
    try {
      const { rows } = await pool.query(
        "select * from users where username = $1",
        [username],
      );
      const user = rows[0];
      console.log(user);
      if (!user) {
        return done(null, false, { message: "Username does not exist!" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// TODO express-session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("select * from users where id = $1", [
      id,
    ]);
    const user = rows[0];
  } catch (err) {
    done(err);
  }
});

export default passport;
