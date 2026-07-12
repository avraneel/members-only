import { Client } from "pg";

const CREATE_TABLES = `
create table if not exists users (
    id          integer primary key generated always as identity,
    first_name  varchar(255) not null,
    last_name   varchar(255) not null,
    username    varchar(255) not null,
    password    varchar(255) not null,
    status      varchar(255)
);

create table if not exists messages (
    id          integer primary key generated always as identity,
    user_id     integer references users,
    timestamp   timestamp,
    text        varchar(255)
);
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  try {
    await client.connect();
    console.log("Creating Tables...");
    await client.query(CREATE_TABLES);
    console.log("Tables created successfully!");
    await client.end();
  } catch (error) {
    console.error(error);
  }
}

main();
