CREATE DATABASE porschehunter;

--\c porschehunter

-- CREATE TABLE IF NOT EXISTS users (
--   id INTEGER PRIMARY KEY,
--   username TEXT UNIQUE,
--   hashed_password BYTEA,
--   salt BYTEA,
--   name TEXT,
--   email TEXT UNIQUE NOT NULL,
--   email_verified INTEGER
-- );

DROP TABLE USERS;

CREATE TABLE IF NOT EXISTS users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  username TEXT
);

CREATE TABLE IF NOT EXISTS federated_credentials (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  UNIQUE (provider, subject)
);

CREATE TABLE IF NOT EXISTS hunts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  hunt_location TEXT
);

CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  hunt_id INTEGER NOT NULL,
  car_model TEXT,
  car_type TEXT
);

