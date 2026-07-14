import pool from "../db/pool.js";

export const indexController = {
  indexControllerGet: async (req, res) => {
    const { rows } = await pool.query("select * from messages;");
    const messages = rows;
    console.log(messages);
    res.render("index", { messages: messages });
  },
};
