DROP DATABASE IF EXISTS home;
CREATE DATABASE home;

\c home;

CREATE TYPE password AS (
	hash VARCHAR NOT NULL,
	salt VARCHAR NOT NULL,
	iterations INTEGER NOT NULL CHECK (iterations > 0)
);

CREATE TABLE roles (
	name VARCHAR PRIMARY KEY
);

CREATE TABLE users (
	name VARCHAR PRIMARY KEY,
	password PASSWORD NOT NULL,
	role VARCHAR NOT NULL REFERENCES roles ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE blog_posts (
	id SERIAL PRIMARY KEY,
	title VARCHAR NOT NULL,
	created TIMESTAMP WITH TIME ZONE NOT NULL,
	modified TIMESTAMP WITH TIME ZONE,
	author VARCHAR REFERENCES users ON UPDATE CASCADE ON DELETE SET NULL,
	body VARCHAR
);

CREATE TABLE tags (
	name VARCHAR PRIMARY KEY
);

CREATE TABLE blog_posts_tags (
	blog_post_id INTEGER REFERENCES blog_posts ON DELETE CASCADE,
	tag_name VARCHAR REFERENCES tags ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (blog_post_id, tag_name)
);