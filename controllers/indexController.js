import pool from "../db/pool.js";

export const indexController = {
  indexControllerGet: async (req, res) => {
    res.locals.currentUser = req.user;
    const { rows: messages } = await pool.query(
      "select * from users join messages on messages.user_id = users.id;",
    );
    messages.forEach((item) => {
      item.timestamp = item.timestamp.toLocaleString();
    });
    res.render("index", { messages: messages });
  },
};
