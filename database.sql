DROP DATABASE porschehunter;
CREATE DATABASE porschehunter;


\c porschehunter;


DROP TABLE users;
CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  username TEXT
);


DROP TABLE hunts;
CREATE TABLE hunts (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  photo_id INTEGER
);


DROP TABLE photos;
CREATE TABLE photos (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL,
  hunt_id INTEGER NOT NULL,
  uri TEXT NOT NULL,
  car_model TEXT,
  car_type TEXT
);

