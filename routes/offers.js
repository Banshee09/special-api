const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const constants = require("../constants");
const Offer = require('../models/offer');


router.get('/', (req, res, next) => {

    const query = Offer.find().select('_id price date product store');

    query.exec().then(docs => {
        const response = {
            count: docs.length,
            offers: docs.map(doc => {
                return {
                    _id: doc._id,
                    price: doc.price,
                    date: doc.date,
                    product: doc.product,
                    store: doc.store,
                    requests: constants.getAPI('GETALL', 'offers', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'offers')
        };

        res.status(500).json(response);
    });

});

router.post('/', (req, res, next) => {

    const offer = new Offer({
        _id: new mongoose.Types.ObjectId(),
        price: req.body.price,
        //date: req.body.date,
        date: new Date(),
        product: req.body.product,
        store: req.body.store
    });

    offer.save().then(result => {

        const response = {
            message: 'Offer created successfully',
            requests:constants.getAPI('POST', 'offers', result._id)
        };

        res.status(201).json(response);

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'offers')
        };

        res.status(500).json(response);
    });
});



router.get('/:offerId', (req, res, next) => {

    const offerId = req.params.offerId;
    const query = Offer.findById(offerId).select('_id price date product store');

    query.exec().then(doc => {

        if(doc){
            const response = {
                _id : doc._id,
                price: doc.price,
                date: doc.date,
                product: doc.product,
                store: doc.store,
                requests: constants.getAPI('GET', 'offers', doc._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'offers')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'offers')
        };

        res.status(500).json(response);
    });
});


router.patch('/:offerId', (req, res, next) => {
    const offerId = req.params.offerId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.key] = ops.value;
    }
    const query = Offer.findByIdAndUpdate(offerId, {$set: updateOps});

    query.exec().then(result => {
        if(result) {
            const response = {
                message: 'Offer updated successfully',
                requests: constants.getAPI('PATCH', 'offers', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'offers')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'offers')
        };

        res.status(500).json(response);
    });
});


router.delete('/:offerId', (req, res, next) => {
    const offerId = req.params.offerId;
    const query = Offer.findByIdAndRemove(offerId);

    query.exec().then(result => {
        if(result) {
            const response = {
                message: 'Offer deleted successfully',
                requests: constants.getAPI('DELETE', 'offers', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'offers')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'offers')
        };

        res.status(500).json(response);
    });
});

module.exports = router;







































