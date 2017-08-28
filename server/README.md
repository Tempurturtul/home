# Home Server

Server for my home on the web.


## Development Quickstart (Ubuntu)

```bash
# ---------------------
# Install Dependencies:
# ---------------------

# Install git.
sudo apt install git

# Install Node.js.
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Update npm.
sudo npm install --global npm

# Install PostgreSQL server.
sudo apt-get install postgresql postgresql-contrib

# ----------------------------
# Set Up Project and Database:
# ----------------------------

# Clone repository.
git clone https://github.com/Tempurturtul/home.git

# Navigate to server package in repository.
cd home/server

# Install Node.js project dependencies.
npm install

# Create database using provided file.
sudo --user=postgres psql --file=db/home.sql

# Create a password for the database.
sudo --user=postgres psql home
# postgres=# \password
# Enter new password:
# Enter it again:
# postgres=# \q

# -----
# Usage
# -----

# Start server. (Ctrl-c to cancel.)
npm start

# Run tests.
npm test
```
