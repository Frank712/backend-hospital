    /*======================================*/
    /*|            Requires                |*/
    /*======================================*/
let express = require('express');
let SEED = require('../config/config').SEED;
let app = express();
let bcrypt = require( 'bcryptjs');
let jwt = require('jsonwebtoken');
    /*======================================*/
    /*|            Models                  |*/
    /*======================================*/
const User = require('../models/user');

app.post( '/', (req, res) =>{
    let body = req.body;
    //  Searching a user by email
    User.findOne({ email: body.email }, (err, userDB) =>{
        if ( err  ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        if( !userDB ){
            return res.status(400).json({
                ok: false,
                message: '(User) or password incorrect!',
                error: err
            });
        }
        if( !bcrypt.compareSync( body.password, userDB.password )  ){
            return res.status(400).json({
                ok: false,
                message: 'User or (password) incorrect!',
                error: err
            });
        }
        //  Change the password to visualization
        userDB.password = '<(:~D)';
        //  Generate the JSON Web Token
        let token = jwt.sign({
           user: userDB
        }, SEED, {expiresIn: 14400}); // 4 hours for expiration
        //  Send a response ok
        res.json({
            ok: true,
            message: 'User login!',
            userDB,
            token
        })
    });
});

module.exports = app;