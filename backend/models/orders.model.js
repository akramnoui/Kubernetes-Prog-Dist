const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cartBags: [{ 
        bag: { type: Schema.Types.ObjectId, ref: 'Bag', requiered: true},
        quantity: { type: Number, requiered: true}
     }],
    totalAmount: { type: Number },
    status: {
        type: String,
        enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);