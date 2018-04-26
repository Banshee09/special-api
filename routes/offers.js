import { checkServerIdentity } from 'tls';

const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const constants = require("../constants");
const Offer = require('../models/offer');
const moment = require('moment-timezone');


router.get('/', (req, res, next) => {

    const query = Offer.find().select('_id price date product store').sort('price');

    query.exec().then(docs => {
        const response = {
            message: `${docs.length} offers found`,
            offers: docs.map(doc => {
                return {
                    _id: doc._id,
                    price: doc.price,
                    date: moment(doc.date).tz('Australia/Sydney').format("DD/MM/YYYY HH:mm:ss"),
                    product: doc.product,
                    store: doc.store,
                    requests: constants.getAPI('offers', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('offers')
        };

        res.status(500).json(response);
    });

});

router.get('/:productId/offers', (req, res, next) => {

    const productId = req.params.productId;
    const query = Offer.find({product:productId}).select('_id price date product store').sort('price');

    query.exec().then(docs => {
        const response = {
            message: `${docs.length} offers found`,
            offers: docs.map(doc => {
                return {
                    _id: doc._id,
                    price: doc.price,
                    date: moment(doc.date).tz('Australia/Sydney').format("DD/MM/YYYY HH:mm:ss"),
                    product: doc.product,
                    store: doc.store,
                    requests: constants.getAPI('offers', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('offers')
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
            requests:constants.getAPI('offers', result._id)
        };

        res.status(201).json(response);

    }).catch(err => {
        
        let message = '';
        if(err.code === 11000)
            message = 'Error - There is an existing offer of this product in this store, please update it rather than create a new one.'
        else
            message = `Error - ${err.message}`
        
        const response = {
            message: message,
            requests: constants.getAPI('offers')
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
                message: `Error - offerId ${offerId} not found in Database`,
                requests: constants.getAPI('offers')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('offers')
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
    updateOps["date"] = new Date();
    
    const query = Offer.findByIdAndUpdate(offerId, {$set: updateOps});

    query.exec().then(result => {
        if(result) {
            const response = {
                message: 'Offer updated successfully',
                requests: constants.getAPI('offers', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                message: `Error - offerId ${offerId} not found in Database`,
                requests: constants.getAPI('offers')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
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
                requests: constants.getAPI('offers', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                message: `Error - offerId ${offerId} not found in Database`,
                requests: constants.getAPI('offers')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('offers')
        };

        res.status(500).json(response);
    });
});

module.exports = router;







































