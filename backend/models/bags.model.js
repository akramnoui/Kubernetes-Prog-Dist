const mongoose = require('mongoose');

const { Schema } = mongoose;

const bagSchema = new Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number, requiered: true },
  quantity: { default: 10, type: Number},
  collectTime: { type: Date },
  nutrients: {
    calories: { type: Number },
    carbs: { type: Number },
    protein: { type: Number },
    fat: { type: Number }
  },
  establishmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Establishment', requiered: true }
});

module.exports = mongoose.model('Bag', bagSchema);
