const {ObjectId} = require("mongodb");
const e = require("express");
module.exports = function(app,favoriteSongsRepository, songsRepository) {

    app.get('/songs/favorites', function (req,res){
        let filter = {user: req.session.user};
        let options = {sort:{title: 1}};

        favoriteSongsRepository.getFavoriteSongs(filter,options).then(songs =>{
            let response = {
                songs:songs,
                totalPrice: songs.reduce((total, favorite) => total + parseFloat(favorite.price), 0),
            };
            res.render("songs/favorites.twig", response);
        }).catch(error =>{
            res.send("Se ha producido un error al listar las canciones favoritas: " + error);
        })
    });

    app.post('/songs/favorites/add/:song_id', function (req,res){
        let songId = req.params.song_id;
        let filter = {_id: new ObjectId(songId)};
        //Comprobamos si existe la cancion
        songsRepository.findSong(filter,{}).then(song =>{
            if (song == null) {
                res.send("No se ha encontrado la canción")
            }
            else { //Comprobamos que la cancion no este en favoritos
                let favFilter = {
                    song_id: new ObjectId(songId),
                    user: req.session.user
                };

                favoriteSongsRepository.findFavoriteSong(favFilter, {}).then(exists => {
                    if (exists!=null) {
                        res.send("Esta canción ya está en tu lista de favoritos.");
                    } else {
                        let favoriteSong = {
                            song_id: song._id,
                            title: song.title,
                            price: song.price,
                            user: req.session.user,
                            date: new Date(),
                            author: song.author
                        };
                        //Añadimos la cancion a favoritos
                        favoriteSongsRepository.insertFavoriteSong(favoriteSong, function (result) {
                            if (result.songId !== null && result.songId !== undefined) {
                                res.redirect("/songs/favorites");
                            } else {
                                res.send("Error al agregar la canción a favoritos")
                            }
                        });
                    }
                }).catch(error =>{
                    res.send("Se ha producido un error al buscar la canción en favoritos: " + error);
                });
            }
        }).catch(error =>{
            res.send("Se ha producido un error al recuperar la canción " + error);
        });
    });

    app.get('/songs/favorites/delete/:song_id', async function (req, res) {
            let songId = req.params.song_id;
            let filter = {
                _id: new ObjectId(songId),
                user: req.session.user
            };

            favoriteSongsRepository.findFavoriteSong(filter, {}).then(exists => {
                if (exists != null) {
                    favoriteSongsRepository.deleteFavoriteSong(filter, {}).then(() => {
                        res.redirect("/songs/favorites");
                    }).catch(error => {
                        res.send("Error al ejecutar el borrado: " + error);
                    });
                } else {
                    res.send("Esta canción no esta en tu lista de favoritos.");
                }
            }).catch(error =>{
                res.send("Se ha producido un error al buscar la canción en favoritos: " + error);
            });
    });
}