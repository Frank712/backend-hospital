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
    });
};

/*======================================*/
/*|   Create a middleware to JWT       |*/
/*======================================*/
module.exports.verifyRoleOrSelf = function(req, res, next) {

    let user = req.user_consult;
    let id = req.params.id;
    if ( user.role === 'ADMIN_ROLE' || user._id === id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'The user is not ADMIN or Self'
        });
    }
};