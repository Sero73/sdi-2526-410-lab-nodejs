module.exports = function(app){
    app.get('/authors', function (req,res){
        let authors=[{
            "name" : "Candice Night",
            "group" : "Cantante",
            "role" : "Blackmore's Night"
        },{
            "name" : "Charlie Parker",
            "group" : "The Quintet",
            "role" : "Saxofonista"
        },{
            "name" : "Frédéric Chopin",
            "group" : "Solista",
            "role" : "Pianista"
        },{
            "name" : " Hilary Hahn",
            "group" : "Solista",
            "role" : "Violinista"
        },{
            "name" : "Louis Armstrong",
            "group" : "Louis Armstrong and his Hot Five",
            "role" : "Trompetista"
        },{
            "name" : "jonathan Davis",
            "group" : "Korn",
            "role" : "Cantante"
        }];

        let response={
            authors: authors
        };
        res.render('authors/authors.twig', response)
    });

    app.get('/authors/add', function (req,res){
        res.render('authors/add.twig')
    });

    app.post('/authors/add', function (req,res){
        let name = req.body.name;
        let group = req.body.group;
        let rol = req.body.role;
        let response = "Autor agregado:" + "<br>";


        name===undefined || name === null || name.trim() ===""? response+="Nombre no enviado en la petición." + "<br>":response+="Nombre: " + name + "<br>";
        group===undefined || group === null || group.trim() ===""? response+="Grupo no enviado en la petición." + "<br>" : response+="Grupo: " + group + "<br>";
        rol===undefined || rol === null || rol.trim() ===""? response+="Rol no enviado en la petición." + "<br>": response+="Rol: " + rol + "<br>";

        res.send(response);
    });

    app.get('/autho*', function (req, res) {
        res.redirect('/authors');
    });

    app.get('/authors/*', function (req, res) {
        res.redirect('/authors');
    });
}
