const Joi = require('joi');

// Validation schema for creating an establishment
const fetchAndCreateEstablishment = {
  body: Joi.object().keys({
    placeId: Joi.string().required(),
  }),
};

// Validation schema for updating an establishment
const updateEstablishment = {
  body: Joi.object().keys({
    name: Joi.string(),
    location: Joi.string(),
  }),
  params: Joi.object().keys({
    establishmentId: Joi.string().required(),
  }),
};

module.exports = {
  fetchAndCreateEstablishment,
  updateEstablishment,
};
