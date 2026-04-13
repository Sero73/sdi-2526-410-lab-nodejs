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

    app.get('/comments/delete/:comment_id', async function (req, res) {
        console.log("Parámetros recibidos:", req.params); // Mira esto en la consola de IntelliJ
        let commentId = req.params.comment_id;
        let filter = {
            _id: new ObjectId(commentId),
            author: req.session.user
        };

        commentsRepository.findComment(filter, {}).then(comment => {
            if (comment != null) {
                commentsRepository.deleteComment(filter, {}).then(() => {
                    res.redirect("/songs/" + comment.song_id);
                }).catch(error => {
                    res.send("Error al ejecutar el borrado: " + error);
                });
            } else {
                //Error pasando mensaje por URL
                res.redirect("/error?message=No puedes borrar un comentario que no es tuyo&messageType=alert-info");
                }
        }).catch(error =>{
            res.send("Se ha producido un error buscando el comentario " + error);
        });
    });
};