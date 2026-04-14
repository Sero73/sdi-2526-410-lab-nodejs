let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');

let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  // Debemos especificar todas las headers que se aceptan. Content-Type , token
  next();
});

let jwt = require('jsonwebtoken');
app.set('jwt', jwt);

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  createParentPath: true
}));

let expressSession = require('express-session');
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}));

const userSessionRouter = require('./routes/userSessionRouter');
const userAuthorRouter = require('./routes/userAuthorRouter');
const userAudiosRouter = require('./routes/userAudiosRouter');
const userTokenRouter = require('./routes/userTokenRouter');
app.use("/songs/add",userSessionRouter);
app.use("/publications",userSessionRouter);
app.use("/songs/buy",userSessionRouter);
app.use("/purchases",userSessionRouter);
app.use("/shop/",userSessionRouter)
app.use("/songs/favorites",userSessionRouter);
app.use("/songs/edit",userAuthorRouter);
app.use("/songs/delete",userAuthorRouter);
app.use("/audios/",userAudiosRouter);
app.use("/api/v1.0/songs/", userTokenRouter);

app.set('uploadPath', __dirname)
app.set('clave','abcdefg');
app.set('crypto',crypto);



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const { MongoClient } = require("mongodb");
const connectionStrings = 'mongodb+srv://admin:sdi@musicstoreapp.tydlruc.mongodb.net/?appName=musicstoreapp';
const dbClient = new MongoClient(connectionStrings);

const usersRepository = require("./repositories/usersRepository.js");
let songsRepository = require("./repositories/songsRepository.js");
let favoriteSongsRepository = require("./repositories/favoriteSongsRepository.js");
let commentsRepository = require("./repositories/commentsRepository.js");

favoriteSongsRepository.init(app,dbClient);
songsRepository.init(app, dbClient);
commentsRepository.init(app,dbClient);
usersRepository.init(app, dbClient);
require("./routes/favorites")(app, favoriteSongsRepository, songsRepository);
require("./routes/songs.js")(app, songsRepository, commentsRepository);
require("./routes/api/songsAPIv1.0.js")(app, songsRepository, usersRepository);
app.use('/', indexRouter);
require("./routes/users.js")(app, usersRepository);
require("./routes/comments.js")(app,commentsRepository);
//app.set('connectionStrings', url);
require("./routes/authors")(app);
require("./routes/util.js")(app);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("Se ha producido un error: " + err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.messageType = err.messageType;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


module.exports = app;
