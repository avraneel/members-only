import { Pool } from "pg";

export default pool = new Pool({
  connectionString: process.env.DB_URL,
});
