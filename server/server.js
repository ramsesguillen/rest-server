require('./config/config');

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
// const routes     = require('./routes/usuario');

/**
 * * HABILIT EXPRESS
*/
const app = express();

/**
 * * HIBILIT BODY PARSER
*/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


/**
 * * RUTAS
*/
app.use( require('./routes/index') );


/**
 * * CONEXION A MONGODB
*/
mongoose.connect('mongodb://localhost/cafe', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, ( err, res ) => {
  if ( err ) throw err;
  console.log('Base de datos ONLINE');
});


/**
 * * INICIADO SERVIDOR
*/
app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
});
