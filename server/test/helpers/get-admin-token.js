import request from 'supertest';
import createUser from './create-user';
import roles from '../../src/lib/user-roles';

let admin;

async function getAdminToken(app) {
	if (!admin) {
		admin = await createUser(app, roles.ADMIN);
	}

	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({
			name: admin.name,
			password: admin.password,
		});

	if (res.body.status !== 'success') {
		throw new Error('Failed to get admin token.');
	}

	const token = res.body.data.token;

	return token;
}

export default getAdminToken;
