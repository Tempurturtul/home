# Home Server

Server for my home on the web.

## API Overview

| Resource 				| `POST` (Create) 						| `GET` (Read) 							| `PUT` (Update) 					| `DELETE` (Delete) 				|
|-----------------------|---------------------------------------|---------------------------------------|-----------------------------------|-----------------------------------|
| `/authenticate` 		| Create a new authorization token. 	| - 									| - 								| - 								|
| `/users` 				| Create a new user. 					| Get a list of all users. *(admin)* 	| - 								| - 								|
| `/users/:name` 		| - 									| Get a user. *(admin, self)* 			| Update a user. *(admin, self)* 	| Delete a user. *(admin, self)* 	|
| `/blog-posts` 		| Create a new blog post. *(admin, contributor)* 	| Get a list of all blog posts. 		| - 								| - 								|
| `/blog-posts/:id` 	| - 									| Get a blog post. 						| Update a blog post. *(admin, contributor [own])* 	| Delete a blog post. *(admin, contributor [own])* 	|

## Quickstart (Ubuntu)

### Install Dependencies:

```bash
# Install git.
sudo apt install git

# Install Node.js.
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Update npm.
sudo npm install --global npm

# Install PostgreSQL.
sudo apt-get install postgresql postgresql-contrib
```

### Set Up Project:

```bash
# Clone repository.
git clone https://github.com/Tempurturtul/home.git

# Navigate to server package in repository.
cd home/server

# Install Node.js project dependencies.
npm install
```

Create a `src/config.js` file using [`src/config.template.js`](./src/config.template.js) as a template.

- A typical local database connection string should look like the following on Ubuntu:
	- `postgres://user:password@localhost:5432/home`

### Set Up Local Database:

***In the following, use the user and password defined in your `src/config.js` file.***

```bash
# Create database using provided file.
sudo --user=YOUR_USER psql --file=src/db/home.sql

# Create a password for the database.
sudo --user=YOUR_USER psql home
# postgres=# \password
# Enter new password: YOUR_PASSWORD
# Enter it again: YOUR_PASSWORD
# postgres=# \q
```

### Usage:

```bash
# Start server. (Ctrl-c to cancel.)
npm start

# Run tests.
npm test
```
