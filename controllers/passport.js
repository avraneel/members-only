import passport from "passport";
import pool from "../db/pool";
import { LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "select * from users where username = $1",
        [username],
      );
      const user = rows[0];

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
