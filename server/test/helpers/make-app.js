import express from 'express';
import bodyParser from 'body-parser';
import apiRouter from '../../src/routes/api';

function makeApp() {
	const app = express();

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use('/api/v1', apiRouter);

	return app;
}

export default makeApp;
