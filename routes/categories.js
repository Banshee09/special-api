const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const constants = require("../constants");
const Category = require('../models/category');
// const Product = require('../models/product');


router.get('/', (req, res, next) => {

    const query = Category.find().select('_id name');

    query.exec().then(docs => {
        const response = {
            count: docs.length,
            categories: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    requests: constants.getAPI('GETALL', 'categories', doc._id)
                }
            }),
        };

        res.status(200).json(response);

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'categories')
        };

        res.status(500).json(response);
    });

});

router.post('/', (req, res, next) => {

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });

    category.save().then(result => {

        const response = {
            message: 'Category created successfully',
            requests:constants.getAPI('POST', 'categories', result._id)
        };

        res.status(201).json(response);

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'categories')
        };

        res.status(500).json(response);
    });
});



router.get('/:categoryId', (req, res, next) => {

    const categoryId = req.params.categoryId;
    const query = Category.findById(categoryId).select('_id name');

    query.exec().then(doc => {

        if(doc){
            const response = {
                _id : doc._id,
                name: doc.name,
                requests: constants.getAPI('GET', 'categories', doc._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'categories')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'categories')
        };

        res.status(500).json(response);
    });
});


router.patch('/:categoryId', (req, res, next) => {
    const categoryId = req.params.categoryId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.key] = ops.value;
    }
    const query = Category.findByIdAndUpdate(categoryId, {$set: updateOps});

    query.exec().then(result => {
        if(result) {
            const response = {
                message: 'Category updated successfully',
                requests: constants.getAPI('PATCH', 'categories', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'categories')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'categories')
        };

        res.status(500).json(response);
    });
});


router.delete('/:categoryId', (req, res, next) => {
    const categoryId = req.params.categoryId;
    const query = Category.findByIdAndRemove(categoryId);

    query.exec().then(result => {
        if(result) {
            const response = {
                message: 'Category deleted successfully',
                requests: constants.getAPI('DELETE', 'categories', result._id)
            };

            res.status(200).json(response);
        }
        else{
            const response = {
                error: 'ID not found in Database',
                requests: constants.getAPI('', 'categories')
            };

            res.status(404).json(response);
        }

    }).catch(err => {
        const response = {
            error: err,
            requests: constants.getAPI('', 'categories')
        };

        res.status(500).json(response);
    });
});

module.exports = router;







































