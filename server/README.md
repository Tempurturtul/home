# Home Server

Server for my home on the web.


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

Create a `config.js` file using [`config.template.js`](./config.template.js) as a template.

- A typical local database connection string should look like the following on Ubuntu:
	- `postgres://user:password@localhost:5432/home`

### Set Up Local Database:

***In the following, use the user and password defined in your `config.js` file.***

```bash
# Create database using provided file.
sudo --user=YOUR_USER psql --file=db/home.sql

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
