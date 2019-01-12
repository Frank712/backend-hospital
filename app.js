/*=//////////////////////////////////////////////////////////*/
/*                     SERVER EXPRESS                       |*/
/*  Description: Contains connection to Database            |*/
/*=//////////////////////////////////////////////////////////*/
    /*======================================*/
    /*|             Requires               |*/
    /*======================================*/
let express = require('express');
let mongoose = require( 'mongoose' );
let bodyParser = require( 'body-parser' );
    /*======================================*/
    /*|         Init all variables         |*/
    /*| [app, body-parser and mongoose]    |*/
    /*======================================*/
let app = express();
//  Creating middleware
//  for x-www-form-encoded
app.use(bodyParser.urlencoded({ extend: true} ));
app.use(bodyParser.json());
    /*======================================*/
    /*|        Importing routes            |*/
    /*======================================*/
let appRoutes = require('./routes/app');
let userRoutes = require('./routes/user');
let hospitalRoutes = require('./routes/hospital');
let loginRoutes = require('./routes/login');
    /*======================================*/
    /*|       Connection to DataBase       |*/
    /*======================================*/
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if( err ){
        throw err;
    }
    console.log('Hospital Mongo DB ONLINE!!!');
});
    /*======================================*/
    /*|        Listen connections          |*/
    /*======================================*/
const port = 3000;
app.listen(port, () =>{
    console.log(`Server ONLINE, listen in port ${port}`);
});
    /*======================================*/
    /*|         Apply routes               |*/
    /*======================================*/
app.use('/login', loginRoutes);
app.use('/users', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/', appRoutes);
