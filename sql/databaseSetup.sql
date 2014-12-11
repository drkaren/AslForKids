DROP DATABASE IF EXISTS aslkids;

CREATE DATABASE aslkids;

USE aslkids;

CREATE TABLE games (
  game_id   INT(10)     NOT NULL PRIMARY KEY,
  game_name VARCHAR(70) NOT NULL
);

INSERT INTO games (game_id, game_name) VALUES(1, 'Memory Cards');
INSERT INTO games (game_id, game_name) VALUES(2, 'Mix & Match');

CREATE TABLE scores (
  score_id INT(25) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username  VARCHAR(70) NOT NULL,
  score    INT(25) NOT NULL DEFAULT 0,
  game_id  INT(10) NOT NULL,
  FOREIGN KEY (game_id) REFERENCES games (game_id)
);