const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const constants = require("../constants");
const Store = require('../models/store');
const Offer = require('../models/offer');


router.get('/', (req, res, next) => {

    const query = Store.find().select('_id name location');

    query.exec().then(docs => {
        const response = {
            message: `${docs.length} stores found`,
            stores: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    location: doc.location,
                    requests: constants.getAPI('stores', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('', 'stores')
        };

        res.status(500).json(response);
    });

});

router.post('/', (req, res, next) => {

    const store = new Store({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        location: req.body.location
    });

    store.save().then(result => {

        const response = {
            message: 'Store created successfully',
            requests: constants.getAPI('stores', result._id)
        };

        res.status(201).json(response);

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('stores')
        };

        res.status(500).json(response);
    });
});



router.get('/:storeId', (req, res, next) => {

    const storeId = req.params.storeId;
    const query = Store.findById(storeId).select('_id name location');

    query.exec().then(doc => {

        if (doc) {
            const response = {
                _id: doc._id,
                name: doc.name,
                location: doc.location,
                requests: constants.getAPI('stores', doc._id)
            };

            res.status(200).json(response);
        }
        else {
            const response = {
                message: `Error - storeId ${storeId} not found in Database`,
                requests: constants.getAPI('stores')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('stores')
        };

        res.status(500).json(response);
    });
});


router.patch('/:storeId', (req, res, next) => {
    const storeId = req.params.storeId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }

    console.log(updateOps);

    const query = Store.findByIdAndUpdate(storeId, { $set: updateOps });

    query.exec().then(result => {
        if (result) {
            const response = {
                message: 'Store updated successfully',
                requests: constants.getAPI('stores', result._id)
            };

            res.status(200).json(response);
        }
        else {
            const response = {
                message: `Error - storeId ${storeId} not found in Database`,
                requests: constants.getAPI('stores')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('', 'stores')
        };

        res.status(500).json(response);
    });
});


router.delete('/:storeId', (req, res, next) => {
    const storeId = req.params.storeId;

    const foreginCheckQuery = Offer.findOne({ store: storeId });

    foreginCheckQuery.exec().then(result => {
        if (result) {
            const response = {
                message: 'Can not delete the Store that is referencing by some Offers',
                requests: constants.getAPI('stores')
            };
            res.status(500).json(response);
        }
        else {
            const query = Store.findByIdAndRemove(storeId);

            query.exec().then(result => {
                if (result) {
                    const response = {
                        message: 'Store deleted successfully',
                        requests: constants.getAPI('DELETE', 'stores', result._id)
                    };

                    res.status(200).json(response);
                }
                else {
                    const response = {
                        message: `Error - storeId ${storeId} not found in Database`,
                        requests: constants.getAPI('', 'stores')
                    };

                    res.status(404).json(response);
                }
            })

        }
    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('', 'stores')
        };

        res.status(500).json(response);
    });




});

module.exports = router;







































