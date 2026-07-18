import { Client } from "pg";
import bcrypt from "bcryptjs";

const CREATE_TABLES = `
create type membership as enum('user', 'member', 'admin');
create table if not exists users (
    id          integer primary key generated always as identity,
    first_name  varchar(255) not null,
    last_name   varchar(255) not null,
    email       varchar(255) not null,
    password    varchar(255) not null,
    status      membership
);

create table if not exists messages (
    id          integer primary key generated always as identity,
    user_id     integer references users not null,
    timestamp   timestamp not null,
    text        text not null
);
`;

const FILL_DATA = `
insert into users (first_name, last_name, email, password, status) values
    ('John', 'Doe', 'johndoe@mail.com', '${await bcrypt.hash("secretstuff", 10)}', 'user'),
    ('Parker', 'Smith', 'parkersmith@mail.com', '${await bcrypt.hash("superdupersecretstuff", 10)}', 'member');

insert into messages (user_id, timestamp, text) values
    (1, current_timestamp, 'drank too much coffee today...head feels dizzy'),
    (2, current_timestamp, 'why not take a walk outside? it will clear up your mind');
`;

const DEL_TABLES = `
truncate session;
drop table users, messages;
drop type membership;
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DB_URL,
  });
  try {
    await client.connect();
    console.log("[CREATE] Creating Tables...");
    await client.query(CREATE_TABLES);
    console.log("[CREATE] Tables created successfully!");
    console.log("[INSERT] Filling up tables with sample data...");
    await client.query(FILL_DATA);
    console.log("[INSERT] Data filled successfully!");
    await client.end();
  } catch (error) {
    console.error(error);
  }
}

main();
