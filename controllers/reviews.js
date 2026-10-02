const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'reviews';

// Helper: validate review payload
const validateReviewPayload = (body) => {
  const { movieId, reviewerName, rating, comment, reviewDate } = body;
  const errors = [];

  if (!movieId || typeof movieId !== 'string' || !ObjectId.isValid(movieId)) {
    errors.push('movieId is required and must be a valid 24-character hexadecimal ObjectId');
  }
  if (!reviewerName || typeof reviewerName !== 'string' || reviewerName.trim() === '') {
    errors.push('reviewerName is required and must be a non-empty string');
  }
  if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 10) {
    errors.push('rating is required and must be a number between 1 and 10');
  }
  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    errors.push('comment is required and must be a non-empty string');
  }
  if (!reviewDate || typeof reviewDate !== 'string' || reviewDate.trim() === '') {
    errors.push('reviewDate is required (e.g., YYYY-MM-DD)');
  }

  return errors;
};

// GET all reviews
const getAll = async (req, res) => {
  try {
    const reviews = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .find()
      .toArray();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve reviews', details: err.message });
  }
};

// GET single review by ID
const getSingle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID format' });
    }

    const review = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve review', details: err.message });
  }
};

// POST create a new review
const createReview = async (req, res) => {
  try {
    const validationErrors = validateReviewPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const { movieId, reviewerName, rating, comment, reviewDate } = req.body;

    const newReview = {
      movieId,
      reviewerName: reviewerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      reviewDate: reviewDate.trim(),
      createdAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .insertOne(newReview);

    res.status(201).json({ id: response.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create review', details: err.message });
  }
};

// PUT update a review by ID
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID format' });
    }

    const validationErrors = validateReviewPayload(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
      });
    }

    const { movieId, reviewerName, rating, comment, reviewDate } = req.body;

    const updatedReview = {
      movieId,
      reviewerName: reviewerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      reviewDate: reviewDate.trim(),
      updatedAt: new Date(),
    };

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .replaceOne({ _id: new ObjectId(id) }, updatedReview);

    if (response.matchedCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review', details: err.message });
  }
};

// DELETE a review by ID
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid review ID format' });
    }

    const response = await mongodb
      .getDb()
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review', details: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createReview,
  updateReview,
  deleteReview,
};
