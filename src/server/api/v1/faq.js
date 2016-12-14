import { Router } from 'express';
const router = new Router();


router.get('/', (req, res) => {
	res.statusCode = 200;
	res.json([{
		id: 1,
		name: 'FAQ #1',
		description: 'This is the description of the FAQ #1'
	}, {
		id: 2,
		name: 'FAQ #2',
		description: 'This is the description of the FAQ #2'
	}, {
		id: 3,
		name: 'FAQ #3',
		description: 'This is the description of the FAQ #3'
	}]);
});

module.exports = router;
