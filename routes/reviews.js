const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');

// GET all reviews
router.get(
  '/',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Retrieve all reviews from the database'
  // #swagger.responses[200] = { description: 'Successfully retrieved all reviews' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.getAll
);

// GET single review by ID
router.get(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Retrieve a single review by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Review ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the review' }
  // #swagger.responses[400] = { description: 'Invalid review ID format' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.getSingle
);

// POST create a new review
router.post(
  '/',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Create a new movie review'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Review payload',
      required: true,
      schema: { $ref: '#/definitions/Review' }
  } */
  // #swagger.responses[201] = { description: 'Review created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[404] = { description: 'Referenced movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.createReview
);

// PUT update a review by ID
router.put(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Update an existing review by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Review ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated review payload',
      required: true,
      schema: { $ref: '#/definitions/Review' }
  } */
  // #swagger.responses[204] = { description: 'Review updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.updateReview
);

// DELETE a review by ID
router.delete(
  '/:id',
  // #swagger.tags = ['Reviews']
  // #swagger.description = 'Delete a review by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Review ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Review deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid review ID format' }
  // #swagger.responses[404] = { description: 'Review not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  reviewsController.deleteReview
);

module.exports = router;
