var express = require('express');
var path = require('path');
var cors=require('cors')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

var app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Path: index.js
var index = require('./routes/index');
app.use('/', index);

app.listen(4004, function () {
    console.log('Example app listening on port 4004!');
    });

module.exports = app;