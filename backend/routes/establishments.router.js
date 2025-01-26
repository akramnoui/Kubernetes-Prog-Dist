const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const establishmentController = require('../controllers/establishments.controller');
const establishmentValidation = require('../validations/establishments.validation');

const router = express.Router();

// get all establishments
router.get('/', establishmentController.getAllEstablishments);

// Register a new establishment
router.post('/', auth('create_establishment'), validate(establishmentValidation.registerEstablishment), establishmentController.fetchAndCreateEstablishment);

// Fetch an establishment by ID
router.get('/:establishmentId', establishmentController.getEstablishmentById);

// Update an establishment by ID
router.patch('/:establishmentId', auth(), validate(establishmentValidation.updateEstablishment), establishmentController.updateEstablishment);

// Delete an establishment by ID
router.delete('/:establishmentId', auth(), establishmentController.deleteEstablishment);

// Add ratings and reviews

// Routes for ratings
router.post('/:establishmentId/ratings', auth('reviews_rating_auth'), establishmentController.addRating);
router.get('/:establishmentId/ratings', establishmentController.getAllRatings);
router.get('/:establishmentId/ratings/:ratingId', establishmentController.getRatingById);
router.delete('/:establishmentId/ratings/:ratingId', auth('reviews_rating_auth'), establishmentController.deleteRatingById);

// Routes for reviews
router.post('/:establishmentId/reviews', auth('reviews_rating_auth'), establishmentController.addReview);
router.get('/:establishmentId/reviews', establishmentController.getAllReviews);
router.get('/:establishmentId/reviews/:reviewId', establishmentController.getReviewById);
router.delete('/:establishmentId/reviews/:reviewId', auth('reviews_rating_auth'), establishmentController.deleteReviewById);

module.exports = router;
