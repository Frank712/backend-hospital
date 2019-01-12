/*======================================*/
/*|            Requires                |*/
/*======================================*/
let SEED = require( '../config/config' ).SEED;
let jwt = require('jsonwebtoken');
/*======================================*/
/*|   Create a middleware to JWT       |*/
/*======================================*/
module.exports.verifyToken = function(req, res, next) {

    let token = req.query.token;
    jwt.verify( token, SEED, ( err, decoded ) =>{
        if ( err ) {
            return res.status(401).json({
                ok: false,
                message: 'Invalid token!',
                error: err
            });
        }
        //  Recover user consultant information
        req.user_consult = decoded.user;
        //  Go to the next Services...
        next();
        /*res.status(200).json({
            ok: false,
            message: 'All right!',
            decoded
        });*/

    });
};
