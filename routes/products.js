const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const constants = require("../constants");
const Product = require('../models/product');


router.get('/', (req, res, next) => {

    const query = Product.find().select('_id name barcode category');

    query.exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    barcode: doc.barcode,
                    category: doc.category,
                    requests: constants.getAPI('GETALL', 'products', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'products')
        };

        res.status(500).json(response);
    });

});

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        barcode: req.body.barcode,
        category: req.body.category,
    });

    product.save().then(result => {

        const response = {
            message: 'Product created successfully',
            requests:constants.getAPI('POST', 'products', result._id)
        };

        res.status(201).json(response);

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'products')
        };

        res.status(500).json(response);
    });
});



router.get('/:productId', (req, res, next) => {

    const productId = req.params.productId;
    const query = Product.findById(productId).select('_id name barcode category');

    query.exec().then(doc => {

        if(doc){
            const response = {
                _id : doc._id,
                name: doc.name,
                barcode: doc.barcode,
                category: doc.category,
                requests: constants.getAPI('GET', 'products', doc._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'products')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'products')
        };

        res.status(500).json(response);
    });
});


router.patch('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.key] = ops.value;
    }
    const query = Product.findByIdAndUpdate(productId, {$set: updateOps});

    query.exec().then(result => {
        if(result) {
            const response = {
                message: 'Product updated successfully',
                requests: constants.getAPI('PATCH', 'products', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'products')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'products')
        };

        res.status(500).json(response);
    });
});


router.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    const query = Product.findByIdAndRemove(productId);

    query.exec().then(result => {
        if(result) {
            const response = {
                message: 'Product deleted successfully',
                requests: constants.getAPI('DELETE', 'products', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'products')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'products')
        };

        res.status(500).json(response);
    });
});

module.exports = router;






































