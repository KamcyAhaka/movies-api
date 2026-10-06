const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all movies (Public)
router.get(
  '/',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Retrieve all movies from the database (Public)'
  // #swagger.responses[200] = { description: 'Successfully retrieved all movies' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  moviesController.getAll
);

// GET single movie by ID (Public)
router.get(
  '/:id',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Retrieve a single movie by its MongoDB ObjectId (Public)'
  // #swagger.parameters['id'] = { description: 'Movie ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the movie' }
  // #swagger.responses[400] = { description: 'Invalid movie ID format' }
  // #swagger.responses[404] = { description: 'Movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  moviesController.getSingle
);

// POST create a new movie (Protected: Authentication required)
router.post(
  '/',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Create a new movie document with 9 required attributes (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Movie payload',
      required: true,
      schema: { $ref: '#/definitions/Movie' }
  } */
  // #swagger.responses[201] = { description: 'Movie created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  moviesController.createMovie
);

// PUT update a movie by ID (Protected: Authentication required)
router.put(
  '/:id',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Update an existing movie document by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Movie ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated movie payload',
      required: true,
      schema: { $ref: '#/definitions/Movie' }
  } */
  // #swagger.responses[204] = { description: 'Movie updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  moviesController.updateMovie
);

// DELETE a movie by ID (Protected: Authentication required)
router.delete(
  '/:id',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Delete a movie document by its MongoDB ObjectId (Requires authentication)'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { description: 'Movie ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Movie deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid movie ID format' }
  // #swagger.responses[401] = { description: 'Unauthorized - Login required' }
  // #swagger.responses[404] = { description: 'Movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  isAuthenticated,
  moviesController.deleteMovie
);

module.exports = router;
