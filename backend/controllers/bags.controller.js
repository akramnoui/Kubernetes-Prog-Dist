const httpStatus = require('http-status');
const Bag = require('../models/bags.model');
const Establishment = require('../models/establishments.model');
const {getNutrientsByDishName} = require('../api/spoonacular')

const controller = {
  getAllBags: async (req, res, next) => {
    try {
      const establishment = await Establishment.findById(req.params.establishmentID).populate('bags');
      console.log();
      if (!establishment) {
        return res.status(404).json({ message: 'Establishment Not Found' });
      }

      res.json({
        establishmentId: req.params.establishmentID,
        bags: establishment.bags
      });
    } catch (error) {
      next(error);
    }
  },

  addOneBag: async (req, res, next) => {
    try {
      const establishmentID = req.params.establishmentID;
      const establishment = await Establishment.findById(establishmentID);
      if (!establishment) {
        return res.status(404).json({ message: 'Establishment Not Found' });
      }

      const nutrientsData = await getNutrientsByDishName(req.body.name);
      console.log(nutrientsData, '########');

      const { calories, fat, protein } = nutrientsData;

      // Construct the `nutrients` object from the extracted data
      const nutrients = {
        calories: calories.value,
        fat: fat.value,
        protein: protein.value
      };

      const newBag = new Bag({
        ...req.body,
        establishmentId: establishmentID,
        nutrients: nutrients
      });

      establishment.bags.push(newBag._id);
      await establishment.save();
      await newBag.save();
      res.status(201).json(newBag);
    } catch (error) {
      console.log(error);
      next(error)
    }
  },
  deleteAllBags: async (req, res, next) => {
    try {
      const establishmentID = req.params.establishmentID;
      const establishment = await Establishment.findById(establishmentID);
      if (!establishment) {
        return res.status(404).json({ message: 'Establishment Not Found' });
      }

      const response = await Bag.deleteMany();
      establishment.bags = [];
      await establishment.save();

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  getOneBag: async (req, res, next) => {
    try {
      const establishmentID = req.params.establishmentID;
      const establishment = await Establishment.findById(establishmentID).populate('bags');
      if (!establishment) {
        return res.status(404).json({ message: 'Establishment Not Found' });
      }

      const bag = establishment.bags.find(b => b._id.equals(req.params.bagID));
      if (!bag) {
        return res.status(404).json({ message: 'Bag Not Found' });
      }

      res.json(bag);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  updateOneBag: async (req, res, next) => {
    try {
      const establishmentID = req.params.establishmentID;
      const establishment = await Establishment.findById(establishmentID).populate('bags');
      if (!establishment) {
        return res.status(404).json({ message: 'Establishment Not Found' });
      }

      const bag = establishment.bags.find(b => b._id.equals(req.params.bagID));
      if (!bag) {
        return res.status(404).json({ message: 'Bag Not Found' });
      }

      // Update bag fields
      Object.assign(bag, req.body);
      await establishment.save();
      bag.save();

      res.json(bag);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  deleteOneBag: async (req, res, next) => {
    try {
      const establishmentID = req.params.establishmentID;
      const establishment = await Establishment.findById(establishmentID);
      if (!establishment) {
        return res.status(404).json({ message: 'Establishment Not Found' });
      }

      const index = establishment.bags.findIndex(b => b.equals(req.params.bagID));
      if (index === -1) {
        return res.status(404).json({ message: 'Bag Not Found' });
      }

      // Remove the bag from the bags array
      establishment.bags.splice(index, 1);
      await Bag.deleteOne({ _id: req.params.bagID });
      await establishment.save();

      res.status(httpStatus.NO_CONTENT);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = controller;
