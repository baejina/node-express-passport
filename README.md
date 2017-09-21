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
    CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT ,
        authId VARCHAR(50) NOT NULL ,
        username VARCHAR(30),
        password VARCHAR(255),
        salt VARCHAR(255),
        displayName VARCHAR(50),
        PRIMARY KEY (id),
        UNIQUE (authId)
    ) ENGINE = InnoDB;
    
