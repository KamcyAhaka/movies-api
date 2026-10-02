const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');

// GET all movies
router.get(
  '/',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Retrieve all movies from the database'
  // #swagger.responses[200] = { description: 'Successfully retrieved all movies' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  moviesController.getAll
);

// GET single movie by ID
router.get(
  '/:id',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Retrieve a single movie by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Movie ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Successfully retrieved the movie' }
  // #swagger.responses[400] = { description: 'Invalid movie ID format' }
  // #swagger.responses[404] = { description: 'Movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  moviesController.getSingle
);

// POST create a new movie
router.post(
  '/',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Create a new movie document with 9 required attributes'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Movie payload',
      required: true,
      schema: { $ref: '#/definitions/Movie' }
  } */
  // #swagger.responses[201] = { description: 'Movie created successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or missing required fields' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  moviesController.createMovie
);

// PUT update a movie by ID
router.put(
  '/:id',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Update an existing movie document by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Movie ObjectId (24 hex characters)', required: true }
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Updated movie payload',
      required: true,
      schema: { $ref: '#/definitions/Movie' }
  } */
  // #swagger.responses[204] = { description: 'Movie updated successfully' }
  // #swagger.responses[400] = { description: 'Validation failed or invalid ID format' }
  // #swagger.responses[404] = { description: 'Movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  moviesController.updateMovie
);

// DELETE a movie by ID
router.delete(
  '/:id',
  // #swagger.tags = ['Movies']
  // #swagger.description = 'Delete a movie document by its MongoDB ObjectId'
  // #swagger.parameters['id'] = { description: 'Movie ObjectId (24 hex characters)', required: true }
  // #swagger.responses[200] = { description: 'Movie deleted successfully' }
  // #swagger.responses[400] = { description: 'Invalid movie ID format' }
  // #swagger.responses[404] = { description: 'Movie not found' }
  // #swagger.responses[500] = { description: 'Internal server error' }
  moviesController.deleteMovie
);

module.exports = router;
