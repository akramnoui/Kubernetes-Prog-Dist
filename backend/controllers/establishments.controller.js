const httpStatus = require('http-status');
const Establishment = require('../models/establishments.model');

const { fetchEstablishmentById, fetchMedia } = require('../api/GooglePlaces');

const getAllEstablishments = async (req, res) => {
  try {
    const establishments = await Establishment.find().populate('bags');
    res.status(httpStatus.OK).json(establishments);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const fetchAndCreateEstablishment = async (req, res) => {
  try {
    const { placeId } = req.body;

    // Fetch establishment details from Google Places API
    const establishmentData = await fetchEstablishmentById(placeId);

    // Check if establishment data is valid
    if (!establishmentData) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Establishment not found' });
    }

    const photosPromises = establishmentData.photos.map(async (photo) => {
      try {
        const photoData = await fetchMedia(photo.name);
        return photoData.photoUri;
      } catch (error) {
        console.error(`Error fetching photo: ${error.message}`);
      }
    });
    const photos = await Promise.all(photosPromises);

    console.log(establishmentData.name);
    console.log(establishmentData.location);

    // Extract relevant establishment details
    const establishment = await Establishment.create({
      name: establishmentData.displayName.text,
      googlePlaceId: establishmentData.id,
      photos,
      address: establishmentData.formattedAddress,
      location: {
        type: 'Point',
        coordinates: [establishmentData.location.longitude, establishmentData.location.latitude]
      },
      owner: req.user.id,
    });

    // Send success response with created establishment data
    res.status(httpStatus.CREATED).json(establishment);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const getEstablishmentById = async (req, res) => {
  try {
    const { establishmentId } = req.params;

    // Find the establishment by ID
    const establishment = await Establishment.findById(establishmentId);

    // Check if the establishment exists
    if (!establishment) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Establishment not found' });
    }

    // If the establishment exists, send it as a response
    res.status(httpStatus.OK).json(establishment);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
};

const updateEstablishment = async (req, res) => {
  try {
    const { establishmentId } = req.params;
    const establishment = await Establishment.findById(establishmentId);

    if (!establishment) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Establishment not found' });
    }

    if (!establishment.owner.equals(req.user.id)) {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    Object.assign(establishment, req.body);
    await establishment.save();
    res.json(establishment);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }
  return null;
};

const deleteEstablishment = async (req, res) => {
  try {
    const { establishmentId } = req.params;
    const establishment = await Establishment.findById(establishmentId);

    if (!establishment) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Establishment not found' });
    }

    if (!establishment.owner.equals(req.user.id)) {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    await establishment.deleteOne();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
  }

  return null;
};

const addRating = async (req, res) => {
  const { establishmentId } = req.params;
  const { rating } = req.body;
  const userId = req.user._id; // Assuming user ID is stored in req.user.id after authentication

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    // Add rating to establishment's ratings array along with user ID
    establishment.ratings.push({ user: userId, rating });
    await establishment.save();

    res.json({ message: 'Rating added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addReview = async (req, res) => {
  const { establishmentId } = req.params;
  const { review } = req.body;
  const userId = req.user.id; // Assuming user ID is stored in req.user.id after authentication

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    // Add review to establishment's reviews array along with user ID
    establishment.reviews.push({ user: userId, review });
    await establishment.save();

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllRatings = async (req, res) => {
  const { establishmentId } = req.params;

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    res.json(establishment.ratings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// method to get a single rating by ID
const getRatingById = async (req, res) => {
  const { establishmentId, ratingId } = req.params;

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    const rating = establishment.ratings.id(ratingId);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// method to delete a single rating by ID
const deleteRatingById = async (req, res) => {
  const { establishmentId, ratingId } = req.params;

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    establishment.ratings.pull(ratingId);
    await establishment.save();

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// method to get all reviews of an establishment
const getAllReviews = async (req, res) => {
  const { establishmentId } = req.params;

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    res.json(establishment.reviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

//method to get a single review by ID
const getReviewById = async (req, res) => {
  const { establishmentId, reviewId } = req.params;

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    const review = establishment.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// method to delete a single review by ID
const deleteReviewById = async (req, res) => {
  const { establishmentId, reviewId } = req.params;

  try {
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).json({ message: 'Establishment not found' });
    }

    establishment.reviews.pull(reviewId);
    await establishment.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllEstablishments,
  fetchAndCreateEstablishment,
  updateEstablishment,
  deleteEstablishment,
  getEstablishmentById,
  addRating,
  addReview,
  getAllRatings,
  getAllReviews,
  getRatingById,
  getReviewById,
  deleteRatingById,
  deleteReviewById
};
