
module.exports.SEED = process.env.SEED || '123456';
module.exports.CLIENT_ID = process.env.CLIENT_ID || '952339169567-gj8edoakhhgairtov5h671q6silseqj4.apps.googleusercontent.com';

    /*======================================*/
    /*|         ENVIROMENT             |*/
    /*======================================*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
    /*======================================*/
    /*|         Database             |*/
    /*======================================*/

let urlDB;

if ( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/hospitalDB';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;


    /*======================================*/
    /*|         url docs POSTMAN           |*/
    /*======================================*/

//  https://documenter.getpostman.com/view/6192337/RznHJdPb