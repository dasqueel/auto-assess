require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.LOCAL_DB_PATH);
mongoose.connect(process.env.REMOTE_DB_PATH);

const cors = require('cors');
const passport = require("passport");

const port = process.env.PORT || 3000;
const server  = express();

// set up server middleware
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cors());
server.use(passport.initialize());

// set up routes
const routes = require('./routes/routes');
routes(server);

server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});
