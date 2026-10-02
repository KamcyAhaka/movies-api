const express = require('express');
const router = express.Router();

const moviesRoutes = require('./movies');
const reviewsRoutes = require('./reviews');

router.get('/', (req, res) => {
  // #swagger.tags = ['Home']
  // #swagger.description = 'API root endpoint'
  res.send('Welcome to the Movies & Reviews REST API! Visit /api-docs for documentation.');
});

router.use('/movies', moviesRoutes);
router.use('/reviews', reviewsRoutes);

module.exports = router;
