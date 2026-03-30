const {ObjectId} = require("mongodb");
const e = require("express");
module.exports = function(app,commentsRepository) {
    app.post('/comments/add/:song_id', function (req,res){
        let songId = req.params.song_id;
        //Comprobamos que la cancion no este en favoritos
        let comment = {
            song_id: new ObjectId(songId),
            text: req.body.text,
            author: req.session.user,
            date: new Date()
        };
            if(req.session.user){
                //Añadimos el comentario
                commentsRepository.insertComment(comment, function (result) {
                    if (result !== null && result !== undefined) {
                        res.redirect("/songs/" + songId);
                    } else {
                        res.send("Error al añdir el comentario");
                    }
                });
            }else{
                res.send("No hay ningún usuario en sesión")
            }

    });
};