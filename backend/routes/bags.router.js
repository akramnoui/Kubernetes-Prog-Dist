const express = require('express');
const router = express.Router();
const bagsController = require('../controllers/bags.controller');
const auth = require('../middlewares/auth');

router.route('/:establishmentID/bags')
    .get(bagsController.getAllBags)
    .post(auth('bag_auth'), bagsController.addOneBag)
    .delete(auth('bag_auth'), bagsController.deleteAllBags);

router.route('/:establishmentID/bags/:bagID')
    .get(bagsController.getOneBag)
    .put(auth('bag_auth'), bagsController.updateOneBag)
    .delete(auth('bag_auth'), bagsController.deleteOneBag);

module.exports = router;
