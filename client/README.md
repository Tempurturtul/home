# Home Client

Client for my home on the web.

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
```

### Set Up Project:

```bash
# Clone repository.
git clone https://github.com/Tempurturtul/home.git

# Navigate to client package in repository.
cd home/client

# Install Node.js project dependencies.
npm install
```

### Usage:

``` bash
# Serve with hot reload at localhost:8080. (Ctrl-c to cancel.)
npm run dev

# Build for production with minification.
npm run build

# Build for production and view the bundle analyzer report.
npm run build --report

# Run unit tests.
npm run unit

# Run end-to-end tests.
npm run e2e

# Run all tests.
npm test
```

For usage details, see the [guide for the webpack vuejs template](https://github.com/vuejs-templates/webpack) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Acknowledgements

Project boilerplate provided by [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack).
