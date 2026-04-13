const {ObjectId} = require("mongodb");
const e = require("express");
module.exports = function(app) {
    app.get('/error', function (req,res){
        let message = "";
        let messageType = "alert-info";

        if (req.session.errores) {
            message = req.session.errores.message;
            messageType = req.session.errores.messageType;

            delete req.session.errores;
        }

        res.render("error.twig", {
            message: message,
            messageType: messageType
        });
    });
}