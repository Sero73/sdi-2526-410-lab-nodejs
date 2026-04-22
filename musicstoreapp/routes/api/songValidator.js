const {check,param} = require('express-validator');
const songsRepository = require('../../repositories/songsRepository');
const {ObjectId} = require('mongodb');

exports.songValidatorInsert = [
    check('title', "Title is required").trim().not().isEmpty(),
    check('title', "Title must be 5 or more characters").trim().isLength({min: 3}),
    check('kind', "Kind is required").trim().not().isEmpty(),
    check('kind',"Kind must be 3 or more charecters").trim().isLength({min: 3}),
    check('price', "Price is required").trim().not().isEmpty(),
    check('price', "Price must be numeric").isNumeric(),
    check('price').custom(value => {
        if(value < 0){
            throw new Error("Price must be greater than 0");
        }
        return true;
    })
];
