import request from 'supertest';

async function getToken(app, name, password) {
	const res = await request(app)
		.post('/api/v1/login')
		.send({
			name,
			password,
		});

	return res.body.data;
}

export default getToken;
