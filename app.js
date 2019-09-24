const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const adminRoutes = require('./routes/AdminRoute');
const userRoutes = require('./routes/UserRoute');
const productRoutes = require('./routes/ProductRoute');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/iaurotest', {
        useNewUrlParser: true
    })
    .then(() => console.log('connected to db'))
    .catch(() => console.log('db connection error'));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.status(200).json({});
    }
    next();
});

app.use('/admins', adminRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.use((req, res, next) => {
    const error = new Error('page not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;