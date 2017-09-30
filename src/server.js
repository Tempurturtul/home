const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

const app = express();

// Set the port.
app.set('port', process.env.PORT || 3000);

// Enable CORS requests.
app.use(cors());

// Use body-parser to parse forms and json in requests.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes.
app.use('/api/v1', apiRouter);

// Start the server.
app.listen(app.get('port'), () => {
	console.log(`Listening on port ${app.get('port')}.`);
});
