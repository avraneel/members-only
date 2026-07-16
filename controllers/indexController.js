import pool from "../db/pool.js";

export const indexController = {
  indexControllerGet: async (req, res) => {
    res.locals.currentUser = req.user;
    const { rows } = await pool.query(
      "select * from users join messages on messages.user_id = users.id;",
    );
    const messages = rows;
    res.render("index", { messages: messages });
  },
};
