const {ObjectId} = require("mongodb");
const e = require("express");
module.exports = function(app) {
    app.get('/error', function (req,res){
        let message = req.query.message;
        let messageType = req.query.messageType;
        res.render("error.twig", {
            message: message,
            messageType: messageType
        });
    });
}