import pool from "../db/pool.js";

export const indexController = {
  indexControllerGet: async (req, res) => {
    const { rows } = await pool.query("select * from messages;");
    const messages = rows;
    res.render("index", { messages: messages });
  },
};
