const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'movies';

// Helper: validate movie payload
const validateMoviePayload = (body) => {
  const {
    title,
    director,
    releaseYear,
    genre,
    rating,
    runtime,
    synopsis,
    language,
    posterUrl,
  } = body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }
  if (!director || typeof director !== 'string' || director.trim() === '') {
    errors.push('director is required and must be a non-empty string');
  }
  if (releaseYear === undefined || typeof releaseYear !== 'number' || releaseYear < 1888) {
    errors.push('releaseYear is required and must be a valid number (>= 1888)');
  }
  if (!genre || typeof genre !== 'string' || genre.trim() === '') {
    errors.push('genre is required and must be a non-empty string');
  }
  if (rating === undefined || typeof rating !== 'number' || rating < 0 || rating > 10) {
    errors.push('rating is required and must be a number between 0 and 10');
  }
  if (runtime === undefined || typeof runtime !== 'number' || runtime <= 0) {
    errors.push('runtime is required and must be a positive number of minutes');
  }
  if (!synopsis || typeof synopsis !== 'string' || synopsis.trim() === '') {
    errors.push('synopsis is required and must be a non-empty string');
  }
  if (!language || typeof language !== 'string' || language.trim() === '') {
    errors.push('language is required and must be a non-empty string');
  }
  if (!posterUrl || typeof posterUrl !== 'string' || posterUrl.trim() === '') {
    errors.push('posterUrl is required and must be a valid string URL');
  }

  return errors;
};

// GET all movies
const getAll = async (req, res) => {
  try {
    const movies = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .find()
      .toArray();
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve movies', details: err.message });
  }
};

// GET single movie by ID
const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid movie ID format' });
    }

    const movie = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve movie', details: err.message });
  }
};

// POST create a new movie
const createMovie = async (req, res) => {
  try {
    const validationErrors = validateMoviePayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const {
      title,
      director,
      releaseYear,
      genre,
      rating,
      runtime,
      synopsis,
      language,
      posterUrl,
    } = req.body;

    const newMovie = {
      title: title.trim(),
      director: director.trim(),
      releaseYear: Number(releaseYear),
      genre: genre.trim(),
      rating: Number(rating),
      runtime: Number(runtime),
      synopsis: synopsis.trim(),
      language: language.trim(),
      posterUrl: posterUrl.trim(),
      createdAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .insertOne(newMovie);

    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create movie', details: err.message });
  }
};

// PUT update a movie by ID
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid movie ID format' });
    }

    const validationErrors = validateMoviePayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const {
      title,
      director,
      releaseYear,
      genre,
      rating,
      runtime,
      synopsis,
      language,
      posterUrl,
    } = req.body;

    const updatedMovie = {
      title: title.trim(),
      director: director.trim(),
      releaseYear: Number(releaseYear),
      genre: genre.trim(),
      rating: Number(rating),
      runtime: Number(runtime),
      synopsis: synopsis.trim(),
      language: language.trim(),
      posterUrl: posterUrl.trim(),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .replaceOne({ _id: new ObjectId(id) }, updatedMovie);

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update movie', details: err.message });
  }
};

// DELETE a movie by ID
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid movie ID format' });
    }

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie', details: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createMovie,
  updateMovie,
  deleteMovie,
};
