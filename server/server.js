const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

const app = express();

// Set the port.
app.set('port', process.env.PORT || 3000);

// Use body-parser to parse forms and json in requests.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes.
app.use('/api/v1', apiRouter);

// Start the server.
app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});
