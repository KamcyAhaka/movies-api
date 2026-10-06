const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all reviews (Public)
router.get(
  '/',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Retrieve all reviews from the database (Public)'
  // #swagger.responses[200] = { description: 'Successfully retrieved all reviews' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.getAll
);

// GET /reviews/user/my-reviews - View logged-in user reviews (Protected)
router.get(
  '/user/my-reviews',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Retrieve reviews created by currently logged-in user (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.responses[200] = { description: 'Successfully retrieved user reviews' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  reviewsController.getMyReviews
);

// GET single review by ID (Public)
router.get(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Retrieve a single review by its MongoDB ObjectId (Public)'
  // #swagger.parameters['id'] = { description: 'Review ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the review' }
  // #swagger.responses[400] = { description: 'Invalid review ID format' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.getSingle
);

// POST create a new review (Protected: Authentication required)
router.post(
  '/',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Create a new movie review (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Review payload',
      required: true,
      schema: { $ref: '#/definitions/Review' }
  } */
  // #swagger.responses[201] = { description: 'Review created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Referenced movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  reviewsController.createReview
);

// PUT update a review by ID (Protected: Authentication required)
router.put(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Update an existing review by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Review ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated review payload',
      required: true,
      schema: { $ref: '#/definitions/Review' }
  } */
  // #swagger.responses[204] = { description: 'Review updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  reviewsController.updateReview
);

// DELETE a review by ID (Protected: Authentication required)
router.delete(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Delete a review by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Review ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Review deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid review ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  reviewsController.deleteReview
);

module.exports = router;
