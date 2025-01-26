const httpStatus = require('http-status');
const Order = require('../models/orders.model');
const Bag = require('../models/bags.model')

const controller = {

    getOrders: async (req, res, next) => {
        try {
            const orders = await Order.find({ user: req.user._id })
                .populate("cartBags.bag")

            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    placeOrder: async (req, res, next) => {
        try {

            const { cartBags } = req.body;
            for (const item of cartBags) {

                const bag = await Bag.findById(item.bag);

                if (!bag) {
                    return res.status(httpStatus.NOT_FOUND).json({message: "bag " +item.bag+ " does not exist"});
                }else if (item.quantity > bag.quantity){
                    return res.status(httpStatus.BAD_REQUEST).json({message: 'Invalid quantity in order'});
                }

                bag.quantity = bag.quantity - item.quantity

                await bag.save();

            }
            const newOrder = new Order({
                user: req.user._id,
                cartBags: req.body.cartBags,
                ...req.body
            });

            await newOrder.save();
            res.status(httpStatus.CREATED).json(newOrder);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    //Get otder by ID
    getOrder: async (req, res, next) => {

        try {
            const orderId = req.params.orderId;
            const order = await Order.findById(orderId)
                .populate('cartBags.bag')
            // .populate('user'); // Optionally populate the user field

            if (!order) {
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Order not found' });
            } else if (!req.user._id.equals(order.user)) {
                console.log(req.user._id);
                console.log(order.user);
                return res.status(httpStatus.FORBIDDEN).json({ Error: "Forbidden" })
            }


            res.status(httpStatus.OK).json(order);
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    // Update order by ID
    updateOrder: async (req, res, next) => {
        try {
            const orderId = req.params.orderId;
            const updates = req.body;
            const options = { new: true }; // Return the modified document

            // Find the existing order
            const existingOrder = await Order.findById(orderId).populate('cartBags.bag');
            if (!existingOrder) {
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Order not found' });
            }

            // Merge the existing order with the updates
            const updatedOrder = Object.assign(existingOrder, updates);

            // Save the updated order
            const savedOrder = await updatedOrder.save();

            res.status(httpStatus.OK).json(savedOrder);
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    // Delete order by ID
    deleteOrder: async (req, res, next) => {
        try {
            const orderId = req.params.orderId;
            const deletedOrder = await Order.findByIdAndDelete(orderId);

            if (!deletedOrder) {
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Order not found' });
            }

            res.status(httpStatus.NO_CONTENT).json({ message: "Order deleted successfully" });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },

    // Delete all orders
    deleteAllOrders: async (req, res, next) => {
        try {
            const result = await Order.deleteMany({});

            if (result.deletedCount === 0) {
                return res.status(httpStatus.NOT_FOUND).json({ message: 'No orders found to delete' });
            }

            res.status(httpStatus.NO_CONTENT).json(result);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

}

module.exports = controller;