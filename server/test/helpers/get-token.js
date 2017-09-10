import request from 'supertest';

async function getToken(app, name, password) {
	const res = await request(app)
		.post('/api/v1/authenticate')
		.send({
			name,
			password,
		});

	if (res.body.status !== 'success') {
		console.log(res.body);
		throw new Error(`Failed to get token for user ${name} with password ${password}.`);
	}

	return res.body.data;
}

export default getToken;
