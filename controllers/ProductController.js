const mongoose = require('mongoose');
const product = require('../models/ProductModel');
const {
    validationResult
} = require('express-validator');

exports.addProduct = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }
    const Product = new product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        manufacturerName: req.body.manufacturerName,
        price: req.body.price,
        isInStock: req.body.isInStock,
        user: req.body.user
    });
    Product.save()
        .then(result => {
            res.status(201).json({
                message: "Product added"
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.showAllProducts = (req, res) => {
    product.find()
        .populate('user', '_id firstName lastName')
        .exec()
        .then(resp => {
            if (resp == null) {
                res.status(409).json({
                    errorMessage: 'No product found'
                });
            } else {
                res.status(200).json({
                    products: resp
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.updateProduct = (req, res) => {
    const updatedProduct = req.body;
    product.update({
            _id: req.params.id
        }, updatedProduct)
        .then(result => {
            res.status(200).json({
                message: "product updated successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "unale to update product",
                error: err
            })
        });
}

exports.deleteProduct = (req, res) => {
    product.findOneAndDelete({
            _id: req.params.id
        })
        .then(result => {
            (result == null ? res.status(403).json({
                message: "product not exists in database",
            }) : res.status(202).json({
                message: "product deleted",
            }));
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: err
            })
        });
}