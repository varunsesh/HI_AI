const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const { MongoClient, ServerApiVersion } = require('mongodb');
//const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/ManualAuth';
const uri = "mongodb+srv://varun:varun123@cluster0.peze9.mongodb.net/usersDB";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const MongoDBURI = uri;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

const index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});