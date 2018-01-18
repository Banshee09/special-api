const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const storeRoutes = require('./routes/stores');
const offerRoutes = require('./routes/offers');


//connect to MongoDB via mongoose
mongoose.connect('mongodb://sam:3821869@cluster0-shard-00-00-jqqte.mongodb.net:27017,cluster0-shard-00-01-jqqte.mongodb.net:27017,cluster0-shard-00-02-jqqte.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
mongoose.Promise = global.Promise;

//set up logging
app.use(morgan('dev'));

//set up the parser for requests
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
}
    next();
});


//set up routes
app.use('/categories',categoryRoutes);
app.use('/products',productRoutes);
app.use('/stores',storeRoutes);
app.use('/offers',offerRoutes);

app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
})
})


module.exports = app;





































