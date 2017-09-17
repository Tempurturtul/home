import request from 'supertest';
import getAdminToken from './get-admin-token';

async function getUser(app, name) {
	const token = await getAdminToken(app);

	const res = await request(app)
		.get(`/api/v1/users/${name}`)
		.send({ token });

	if (res.body.status !== 'success') {
		console.error(res.body.data);
		throw new Error(`Failed to get user ${name}.`);
	}

	const user = res.body.data.user;

	return user;
}

export default getUser;
