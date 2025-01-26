const mongoose = require('mongoose');

const establishmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        index: '2dsphere' // Ensure indexing for geospatial queries
      }
    },
    photos: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bag" }],
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number }
    }],
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      review: { type: String }
    }]
  },
  {
    timestamps: true,
  },
);


const Establishment = mongoose.model('Establishment', establishmentSchema);

module.exports = Establishment;
