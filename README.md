#Introduction
=================
	basic login, logout, authentication

#Prerequisite
=================
	node
	npm
	mysql

#Usage
=================
	npm install
	supervisor app-server.js

	localhost:3005/auth/login

#Technology
=================
	Node.js
	Express
	Passport.js
	Bkfd2Password
	Jade

#create table
=================
  3 // CREATE TABLE users (
  4 //     id INT NOT NULL AUTO_INCREMENT ,
  5 //     authId VARCHAR(50) NOT NULL ,
  6 //     username VARCHAR(30),
  7 //     password VARCHAR(255),
  8 //     salt VARCHAR(255),
  9 //     displayName VARCHAR(50),
 10 //     PRIMARY KEY (id),
 11 //     UNIQUE (authId)
 12 // ) ENGINE = InnoDB;
