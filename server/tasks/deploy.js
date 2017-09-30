const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const ghpages = require('gh-pages');

const options = {
	src: [
		'*',
		'*/**',
		'!node_modules/**',
		'!test/**',
		'!tasks/**',
	],
	branch: 'heroku-server',
};

ghpages.publish(path.join(__dirname, '..'), options, (err) => {
	if (err) {
		console.error(err);
	} else {
		console.log('Successfully deployed.');
	}
});
