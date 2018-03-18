const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const storeRoutes = require('./routes/stores');
const offerRoutes = require('./routes/offers');
const constants = require('./constants');


//connect to MongoDB via mongoose
mongoose.connect(constants.DB_URL);
mongoose.Promise = global.Promise;

//set up logging
app.use(morgan('dev'));

//set up the parser for multi-part requests
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//enable cors
const cors = require('cors');
app.use(cors());

//set up routes
app.use('/categories', categoryRoutes);
app.use('/category', productRoutes);
app.use('/stores', storeRoutes);
app.use('/products', productRoutes);
app.use('/product', offerRoutes);
app.use('/offers', offerRoutes);

app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;





































