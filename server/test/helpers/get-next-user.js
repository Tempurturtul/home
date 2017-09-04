import request from 'supertest';
import getToken from './get-token';
import testData from './test-data.json';

const admin = testData.users.admin;
let counter = 0;

async function getNextUser(app) {
	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.get('/api/v1/users')
		.send({ token });

	if (counter >= res.body.data.length) {
		throw new Error('No more unused users. Increase number of users in test database.');
	}

	const user = res.body.data[counter];

	counter++;

	return user;
}

export default getNextUser;
