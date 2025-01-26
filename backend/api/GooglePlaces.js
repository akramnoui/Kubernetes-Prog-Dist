const axios = require('axios');
const config = require('../config/config');

const fetchEstablishmentById = async (placeId) => {
  try {
    const response = await axios.get(`https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,photos,location,formattedAddress&key=${config.googlePlaces}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching establishment details', error);
  }
};

const fetchMedia = async (placeName) => {
  try {
    const response = await axios.get(`https://places.googleapis.com/v1/${placeName}/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true&key=${config.googlePlaces}`);

    return response.data;
  } catch (error) {
    throw new Error('Error fetching media', error);
  }
};

module.exports = {
  fetchEstablishmentById,
  fetchMedia,
};
