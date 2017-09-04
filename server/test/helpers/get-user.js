import request from 'supertest';
import getToken from './get-token';
import testData from './test-data.json';

const admin = testData.users.admin;

async function getUser(app, name) {
	const token = await getToken(app, admin.name, admin.password);

	const res = await request(app)
		.get(`/api/v1/users/${name}`)
		.send({ token });

	return res.body.data;
}

export default getUser;
