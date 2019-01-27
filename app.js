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
    /*======================================*/
    /*|         Enabling CROS-Origin       |*/
    /*======================================*/
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});
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
let doctorRoutes = require('./routes/doctor');
let loginRoutes = require('./routes/login');
let searchRoutes = require('./routes/search');
let uploadRoutes = require('./routes/upload');
let imagesRoutes = require('./routes/images');
    /*======================================*/
    /*|       Connection to DataBase       |*/
    /*======================================*/
mongoose.connection.openUri(process.env.URL_DB, (err, resp) => {
    if( err ){
        throw err;
    }
    console.log('Hospital Mongo DB ONLINE!!!');
});
    /*======================================*/
    /*|        Listen connections          |*/
    /*======================================*/
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Server ONLINE, listen in port ${port}`);
});

    /*======================================*/
    /*|         Serve-index config         |*/
    /*======================================*/
/*let serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/
    /*======================================*/
    /*|         Apply routes               |*/
    /*======================================*/
app.use('/login', loginRoutes);
app.use('/users', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
app.use('/', appRoutes);

