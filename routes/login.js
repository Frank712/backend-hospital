    /*======================================*/
    /*|            Requires                |*/
    /*======================================*/
let express = require('express');
let SEED = require('../config/config').SEED;
let app = express();
let bcrypt = require( 'bcryptjs');
let jwt = require('jsonwebtoken');
    /*======================================*/
    /*|         Google Requires            |*/
    /*======================================*/
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
    /*======================================*/
    /*|            Models                  |*/
    /*======================================*/
const User = require('../models/user');
    /*======================================*/
    /*|         Login Google               |*/
    /*======================================*/
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post( '/google', async(req, res) =>{
    let token = req.body.token;
    let googleUser = await verify(token)
        .catch( err =>{
            return res.status(403).json({
                ok: false,
                message: 'Invalid token',
                error: err
            });
        });
    console.log(googleUser);

    User.findOne({email: googleUser.email}, (err, userDB)=>{
        if ( err  ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        if( userDB ){
            if( userDB.google === false ){
                return res.status(400).json({
                    ok: false,
                    message: 'You must be use a normal authentication'
                });
            } else {
                //  Generating a owner token
                let token = jwt.sign({
                    user: userDB
                }, SEED, {expiresIn: 14400}); // 4 hours for expiration
                //  Send a response ok
                res.json({
                    ok: true,
                    message: 'User login!',
                    userDB,
                    token
                });
            }
        } else {
            let user = new User({
                name: googleUser.name,
                lastname: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                password: '>:/',
                google: true
            });
            console.log(user);
            user.save((err, userSaved) =>{
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        message: 'An error has been occurred while try to save a google user!',
                        error: err
                    });
                }
                //  Generating a owner token
                let token = jwt.sign({
                    user: userSaved
                }, SEED, {expiresIn: 14400}); // 4 hours for expiration
                //  Send a response ok
                res.json({
                    ok: true,
                    message: 'User saved successfully!',
                    userSaved,
                    token
                });
            });
        }
    });
});

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
        });
    });
});

module.exports = app;