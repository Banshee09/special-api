const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const constants = require("../constants");
const Product = require('../models/product');
const Offer = require('../models/offer');


router.get('/', (req, res, next) => {

    const query = Product.find().select('_id name barcode category');

    query.exec().then(docs => {
        const response = {
            message: `${docs.length} products found`,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    barcode: doc.barcode,
                    category: doc.category,
                    requests: constants.getAPI('products', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('products')
        };

        res.status(500).json(response);
    });

});

router.get('/:categoryId/products', (req, res, next) => {
    const categoryId = req.params.categoryId;

    const query = Product.find({ category: categoryId }).select('_id name barcode category');

    query.exec().then(docs => {
        const response = {
            message: `${docs.length} products found`,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    barcode: doc.barcode,
                    category: doc.category,
                    requests: constants.getAPI('products', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('products')
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
            requests: constants.getAPI('products', result._id)
        };

        res.status(201).json(response);

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('products')
        };

        res.status(500).json(response);
    });
});



router.get('/:productId', (req, res, next) => {

    const productId = req.params.productId;
    const query = Product.findById(productId).select('_id name barcode category');

    query.exec().then(doc => {

        if (doc) {
            const response = {
                _id: doc._id,
                name: doc.name,
                barcode: doc.barcode,
                category: doc.category,
                requests: constants.getAPI('products', doc._id)
            };

            res.status(200).json(response);
        }
        else {
            const response = {
                message: `Error - productId ${productId} not found in Database`,
                requests: constants.getAPI('', 'products')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('', 'products')
        };

        res.status(500).json(response);
    });
});


router.patch('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.key] = ops.value;
    }
    const query = Product.findByIdAndUpdate(productId, { $set: updateOps });

    query.exec().then(result => {
        if (result) {
            const response = {
                message: 'Product updated successfully',
                requests: constants.getAPI('PATCH', 'products', result._id)
            };

            res.status(200).json(response);
        }
        else {
            const response = {
                message: `Error - productId ${productId} not found in Database`,
                requests: constants.getAPI('products')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('products')
        };

        res.status(500).json(response);
    });
});


router.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId;

    const foreginCheckQuery = Offer.findOne({ product: productId });

    foreginCheckQuery.exec().then(result => {
        if (result) {
            const response = {
                message: 'Can not delete the Product that is referencing by some Offers',
                requests: constants.getAPI('products')
            };
            res.status(500).json(response);
        }
        else {
            const query = Product.findByIdAndRemove(productId);

            query.exec().then(result => {
                if (result) {
                    const response = {
                        message: 'Product deleted successfully',
                        requests: constants.getAPI('DELETE', 'products', result._id)
                    };

                    res.status(200).json(response);
                }
                else {
                    const response = {
                        message: `Error - productId ${productId} not found in Database`,
                        requests: constants.getAPI('products')
                    };

                    res.status(404).json(response);
                }

            })
        }
    }).catch(err => {
        const response = {
            message: `Error - ${err}`,
            requests: constants.getAPI('products')
        };

        res.status(500).json(response);
    });
});

module.exports = router;







































